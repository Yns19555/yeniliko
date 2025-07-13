import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, generateToken } from '@/lib/auth-utils';
import { db, isSupabaseAvailable } from '@/lib/supabase';
import { registerSchema, validateInput, sanitizeEmail } from '@/lib/validation';

// Mock users storage (fallback when Supabase not available)
const mockUsers: any[] = [];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate input
    console.log('Register request body:', body);
    const validation = validateInput(registerSchema, body);
    if (!validation.success) {
      console.log('Validation errors:', validation.errors);
      return NextResponse.json(
        {
          error: validation.errors?.[0] || 'Geçersiz kayıt verileri',
          details: validation.errors
        },
        { status: 400 }
      );
    }

    const { email, password, firstName, lastName, phone, acceptTerms, acceptMarketing } = validation.data!;
    const sanitizedEmail = sanitizeEmail(email);

    // Check if Supabase is available
    if (isSupabaseAvailable()) {
      try {
        // Check if user exists in Supabase
        const existingUser = await db.getUserByEmail(sanitizedEmail);

        if (existingUser) {
          return NextResponse.json(
            { error: 'Bu email adresi zaten kullanımda' },
            { status: 400 }
          );
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user in Supabase
        const user = await db.createUser({
          email: sanitizedEmail,
          password: hashedPassword,
          first_name: firstName,
          last_name: lastName,
          phone: phone || undefined,
          role: 'USER',
          email_verified: true, // Auto-verify for demo
          is_active: true,
          accept_marketing: acceptMarketing || false
        });

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

        // Return user data and token
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
    const existingUser = mockUsers.find(u => u.email === sanitizedEmail);

    if (existingUser) {
      return NextResponse.json(
        { error: 'Bu email adresi zaten kullanımda' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user in mock storage
    const user = {
      id: `user_${Date.now()}`,
      email: sanitizedEmail,
      password: hashedPassword,
      firstName,
      lastName,
      phone: phone || null,
      role: 'USER' as const,
      emailVerified: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: null as Date | null
    };

    mockUsers.push(user);

    // Generate token
    const token = generateToken(user);

    // Return user data and token
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
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Kayıt işlemi başarısız oldu' },
      { status: 500 }
    );
  }
}
