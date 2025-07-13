import { NextRequest, NextResponse } from 'next/server';
import { db, isSupabaseAvailable } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    // Check if Supabase is available
    if (!isSupabaseAvailable()) {
      // Return mock data when Supabase not available
      const mockUsers = [
        {
          id: '1',
          first_name: 'Admin',
          last_name: 'User',
          email: 'admin@yeniliko.com',
          phone: '+90 555 123 45 67',
          role: 'ADMIN',
          is_active: true,
          email_verified: true,
          created_at: new Date().toISOString(),
          last_login: null
        }
      ];

      // Transform data for frontend
      const users = mockUsers;
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
        totalOrders: 0,
        totalSpent: 0,
        cartItems: [],
        activities: [
          {
            type: 'register',
            description: 'Hesap oluşturdu',
            timestamp: user.created_at
          }
        ]
      }));

      return NextResponse.json(transformedUsers);
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
