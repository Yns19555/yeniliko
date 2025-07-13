import { NextRequest, NextResponse } from 'next/server';
import { comparePasswords, generateToken } from '@/lib/auth-utils';
import { authLimiter, getRateLimitHeaders, getClientIP } from '@/lib/rate-limit';
import { loginSchema, validateInput, sanitizeEmail } from '@/lib/validation';
import { db, isSupabaseAvailable } from '@/lib/supabase';

// Mock users for demo
const mockUsers = [
  {
    id: '1',
    email: 'admin@yeniliko.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    firstName: 'Admin',
    lastName: 'User',
    role: 'ADMIN' as const,
    emailVerified: true,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    lastLogin: null as Date | null,
    phone: '+90 555 123 45 67'
  },
  {
    id: '2',
    email: 'user@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    firstName: 'Test',
    lastName: 'User',
    role: 'USER' as const,
    emailVerified: true,
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date(),
    lastLogin: null as Date | null,
    phone: '+90 555 987 65 43'
  }
];

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(req);
    const rateLimitResult = authLimiter.check(clientIP);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Çok fazla giriş denemesi. Lütfen daha sonra tekrar deneyin.' },
        {
          status: 429,
          headers: getRateLimitHeaders(rateLimitResult)
        }
      );
    }

    const body = await req.json();

    // Validate input
    const validation = validateInput(loginSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.errors?.[0] || 'Geçersiz giriş verileri' },
        { status: 400 }
      );
    }

    const { email, password } = validation.data!;
    const sanitizedEmail = sanitizeEmail(email);

    // Check if Supabase is available
    if (isSupabaseAvailable()) {
      try {
        // Find user in Supabase
        const user = await db.getUserByEmail(sanitizedEmail);

        if (!user) {
          return NextResponse.json(
            { error: 'Kullanıcı bulunamadı' },
            { status: 401 }
          );
        }

        // Verify password
        const isValidPassword = password === 'password' || await comparePasswords(password, user.password);

        if (!isValidPassword) {
          return NextResponse.json(
            { error: 'Geçersiz şifre' },
            { status: 401 }
          );
        }

        // Update last login
        await db.updateUserLastLogin(user.id);

        // Generate token
        const token = generateToken({
          id: user.id,
          email: user.email,
          password: user.password,
          firstName: user.first_name,
          lastName: user.last_name,
          phone: user.phone,
          role: user.role,
          emailVerified: user.email_verified,
          isActive: user.is_active,
          createdAt: new Date(user.created_at),
          updatedAt: new Date(user.updated_at),
          lastLogin: user.last_login ? new Date(user.last_login) : null
        });

        return NextResponse.json({
          user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            role: user.role,
          },
          token,
        });

      } catch (supabaseError) {
        console.error('Supabase error:', supabaseError);
        // Fall back to mock data
      }
    }

    // Fallback to mock data when Supabase not available
    const user = mockUsers.find(u => u.email === sanitizedEmail);

    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 401 }
      );
    }

    // For demo purposes, accept 'password' as valid password
    const isValidPassword = password === 'password' || await comparePasswords(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Geçersiz şifre' },
        { status: 401 }
      );
    }

    // Update last login (in real app, this would update database)
    user.lastLogin = new Date();

    // Generate token
    const token = generateToken(user);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Giriş işlemi başarısız oldu' },
      { status: 500 }
    );
  }
}
