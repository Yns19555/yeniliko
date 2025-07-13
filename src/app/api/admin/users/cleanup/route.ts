import { NextRequest, NextResponse } from 'next/server';
import { db, isSupabaseAvailable } from '@/lib/supabase';
import { hashPassword } from '@/lib/auth-utils';

export async function POST(req: NextRequest) {
  try {
    // Check if Supabase is available
    if (!isSupabaseAvailable()) {
      return NextResponse.json(
        { error: 'Supabase bağlantısı mevcut değil' },
        { status: 500 }
      );
    }

    // Get all users first to see what we have
    const allUsers = await db.getAllUsers();
    console.log('Mevcut kullanıcılar:', allUsers);

    // Delete all users except admin
    await db.deleteAllUsersExceptAdmin();

    // Create admin user if not exists
    const adminEmail = 'admin@yeniliko.com';
    const existingAdmin = await db.getUserByEmail(adminEmail);

    if (!existingAdmin) {
      const hashedPassword = await hashPassword('admin123');
      
      await db.createUser({
        email: adminEmail,
        password: hashedPassword,
        first_name: 'Admin',
        last_name: 'User',
        phone: '+90 555 123 45 67',
        role: 'ADMIN',
        email_verified: true,
        is_active: true,
        accept_marketing: false
      });

      console.log('Admin kullanıcısı oluşturuldu');
    }

    // Get final user list
    const finalUsers = await db.getAllUsers();

    return NextResponse.json({
      success: true,
      message: 'Kullanıcılar temizlendi, sadece admin kaldı',
      before: allUsers.length,
      after: finalUsers.length,
      users: finalUsers
    });

  } catch (error) {
    console.error('Cleanup error:', error);
    return NextResponse.json(
      { error: 'Temizleme işlemi başarısız oldu' },
      { status: 500 }
    );
  }
}
