import { NextRequest, NextResponse } from 'next/server';
import { db, isSupabaseAvailable } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    // Check if Supabase is available
    if (!isSupabaseAvailable()) {
      return NextResponse.json(
        { error: 'Supabase bağlantısı mevcut değil' },
        { status: 500 }
      );
    }

    // Get all users from Supabase
    const users = await db.getAllUsers();

    // Transform data for frontend
    const transformedUsers = users.map(user => ({
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      phone: user.phone || '',
      role: user.role.toLowerCase(),
      isActive: user.is_active,
      emailVerified: user.email_verified,
      createdAt: user.created_at,
      lastLogin: user.last_login,
      totalOrders: 0, // Bu bilgiler orders tablosundan gelecek
      totalSpent: 0,
      cartItems: [], // Bu bilgiler cart tablosundan gelecek
      activities: [
        {
          type: 'register',
          description: 'Hesap oluşturdu',
          timestamp: user.created_at
        }
      ]
    }));

    return NextResponse.json(transformedUsers);

  } catch (error) {
    console.error('Users fetch error:', error);
    return NextResponse.json(
      { error: 'Kullanıcılar yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
