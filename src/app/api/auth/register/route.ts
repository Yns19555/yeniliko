import { NextRequest, NextResponse } from 'next/server';
// import prisma from '@/lib/prisma';
import { hashPassword, generateToken } from '@/lib/auth-utils';

// Mock users storage (in real app, this would be database)
const mockUsers: any[] = [];

export async function POST(req: NextRequest) {
  try {
    const { email, password, firstName, lastName, phone } = await req.json();

    // Email validation
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Geçerli bir email adresi giriniz' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = mockUsers.find(u => u.email === email);

    if (existingUser) {
      return NextResponse.json(
        { error: 'Bu email adresi zaten kullanımda' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = {
      id: `user_${Date.now()}`,
      email,
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

    // Add to mock storage
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
