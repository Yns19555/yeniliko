import { NextRequest, NextResponse } from 'next/server';
import { db, isSupabaseAvailable } from '@/lib/supabase';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;
    const { role } = await req.json();

    // Validate role
    const validRoles = ['USER', 'ADMIN', 'MANAGER'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Geçersiz rol' },
        { status: 400 }
      );
    }

    // Check if Supabase is available
    if (!isSupabaseAvailable()) {
      return NextResponse.json(
        { error: 'Supabase bağlantısı mevcut değil' },
        { status: 500 }
      );
    }

    // Update user role in Supabase
    const updatedUser = await db.updateUserRole(userId, role);

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    console.log(`✅ User role updated: ${updatedUser.email} -> ${role}`);

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name
      }
    });

  } catch (error) {
    console.error('❌ Role update error:', error);
    return NextResponse.json(
      { error: 'Rol güncellenirken hata oluştu' },
      { status: 500 }
    );
  }
}
