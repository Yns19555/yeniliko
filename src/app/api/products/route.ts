import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/middleware/auth';
import { db, isSupabaseAvailable } from '@/lib/supabase';

// Mock data for demo
const mockProducts = [
  {
    id: 1,
    name: 'Özel Tasarım Telefon Standı',
    description: 'Ergonomik tasarımı ile telefonunuzu ideal açıda tutar.',
    price: 45,
    stock: 15,
    category: 'Aksesuarlar',
    images: ['📱'],
    _count: { orderItems: 12 }
  },
  {
    id: 2,
    name: 'Geometrik Vazo Seti',
    description: 'Modern dekorasyon için geometrik vazo seti.',
    price: 120,
    stock: 8,
    category: 'Dekorasyon',
    images: ['🏺'],
    _count: { orderItems: 5 }
  },
  {
    id: 3,
    name: 'Ergonomik Klavye Desteği',
    description: 'Çalışma konforunuzu artıran klavye desteği.',
    price: 85,
    stock: 20,
    category: 'Ofis',
    images: ['⌨️'],
    _count: { orderItems: 8 }
  }
];

export async function GET() {
  try {
    // Check if Supabase is available
    if (isSupabaseAvailable()) {
      try {
        const products = await db.getProducts();
        return NextResponse.json(products);
      } catch (supabaseError) {
        console.error('Supabase error:', supabaseError);
        // Fall back to mock data
      }
    }

    // Fallback to mock data
    await new Promise(resolve => setTimeout(resolve, 100));
    return NextResponse.json(mockProducts);
  } catch (error) {
    console.error('Products fetch error:', error);
    return NextResponse.json(
      { error: 'Ürünler yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Auth check
    const authResponse = await authMiddleware(req);
    if (authResponse.status !== 200) {
      return authResponse;
    }

    const { name, description, price, stock, category, images } = await req.json();

    // Mock product creation
    const product = {
      id: Date.now(),
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      category,
      images: Array.isArray(images) ? images : [images],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json(product);
  } catch (error) {
    console.error('Product creation error:', error);
    return NextResponse.json(
      { error: 'Ürün oluşturulurken bir hata oluştu' },
      { status: 500 }
    );
  }
}
