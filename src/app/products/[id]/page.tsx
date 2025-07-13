'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import { useCart } from '@/contexts/CartContext';

// Demo ürün verileri (gerçek uygulamada API'den gelecek)
const productData = {
  1: {
    id: 1,
    name: 'Özel Tasarım Telefon Standı',
    price: 45,
    originalPrice: 60,
    category: 'Aksesuarlar',
    rating: 4.8,
    reviews: 124,
    images: ['📱', '📱', '📱', '📱'],
    inStock: true,
    stockCount: 15,
    description: 'Ergonomik tasarımı ile telefonunuzu ideal açıda tutar. 3D yazıcı teknolojisi ile üretilmiş, dayanıklı PLA malzemeden yapılmıştır.',
    features: [
      'Ergonomik tasarım',
      'Dayanıklı PLA malzeme',
      'Kaymaz taban',
      'Çok fonksiyonlu kullanım',
      'Kolay temizlik'
    ],
    specifications: {
      'Malzeme': 'PLA Plastik',
      'Boyutlar': '12cm x 8cm x 6cm',
      'Ağırlık': '85g',
      'Renk': 'Siyah, Beyaz, Gri',
      'Uyumluluk': 'Tüm telefon modelleri'
    },
    colors: ['Siyah', 'Beyaz', 'Gri'],
    relatedProducts: [2, 3, 4]
  },
  2: {
    id: 2,
    name: 'Geometrik Vazo Seti',
    price: 120,
    originalPrice: null,
    category: 'Dekorasyon',
    rating: 4.9,
    reviews: 89,
    images: ['🏺', '🏺', '🏺'],
    inStock: true,
    stockCount: 8,
    description: 'Modern geometrik tasarımı ile evinize şıklık katacak vazo seti. 3 farklı boyutta, minimalist tasarım.',
    features: [
      'Modern geometrik tasarım',
      '3 farklı boyut',
      'Su geçirmez kaplama',
      'Minimalist görünüm',
      'Kolay bakım'
    ],
    specifications: {
      'Malzeme': 'PETG Plastik',
      'Set İçeriği': '3 Adet Vazo',
      'Boyutlar': 'Küçük: 8cm, Orta: 12cm, Büyük: 16cm',
      'Ağırlık': '320g (set)',
      'Renk': 'Beyaz, Siyah'
    },
    colors: ['Beyaz', 'Siyah'],
    relatedProducts: [1, 4, 6]
  }
};

export default function ProductDetailPage() {
  const params = useParams();
  const productId = parseInt(params.id as string);
  const product = productData[productId as keyof typeof productData];
  const { addToCart } = useCart();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const handleAddToCart = () => {
    if (!product) return;

    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        category: product.category,
        selectedColor: selectedColor,
        maxStock: product.stockCount
      });
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Ürün Bulunamadı</h1>
          <Link href="/products" className="text-orange-500 hover:underline">
            Ürünlere Geri Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-orange-500">Ana Sayfa</Link>
            <span className="text-gray-400">/</span>
            <Link href="/products" className="text-gray-500 hover:text-orange-500">Ürünler</Link>
            <span className="text-gray-400">/</span>
            <Link href={`/products?category=${product.category}`} className="text-gray-500 hover:text-orange-500">
              {product.category}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Ürün Resimleri */}
          <div className="space-y-6">
            {/* Ana Resim */}
            <div className="aspect-square bg-white rounded-2xl shadow-lg flex items-center justify-center text-9xl border">
              {product.images[selectedImage]}
            </div>

            {/* Küçük Resimler */}
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-white rounded-lg flex items-center justify-center text-4xl border-2 transition-all ${
                    selectedImage === index
                      ? 'border-orange-500 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {image}
                </button>
              ))}
            </div>
          </div>

          {/* Ürün Bilgileri */}
          <div className="space-y-8">
            {/* Başlık ve Rating */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-sm text-orange-500 font-semibold bg-orange-500/10 px-3 py-1 rounded-full">
                  {product.category}
                </span>
                {product.inStock && (
                  <span className="text-sm text-green-600 font-semibold bg-green-100 px-3 py-1 rounded-full">
                    Stokta Var
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-sm text-gray-600 ml-2">
                    {product.rating} ({product.reviews} değerlendirme)
                  </span>
                </div>
              </div>
            </div>

            {/* Fiyat */}
            <div className="flex items-center space-x-4">
              <span className="text-4xl font-bold text-orange-500">₺{product.price}</span>
              {product.originalPrice && (
                <span className="text-xl text-gray-500 line-through">₺{product.originalPrice}</span>
              )}
              {product.originalPrice && (
                <span className="bg-red-100 text-red-600 text-sm font-semibold px-3 py-1 rounded-full">
                  %{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)} İndirim
                </span>
              )}
            </div>

            {/* Renk Seçimi */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Renk Seçimi</h3>
              <div className="flex space-x-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                      selectedColor === color
                        ? 'border-orange-500 bg-orange-50 text-orange-600'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Miktar Seçimi */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Miktar</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-l-lg"
                  >
                    -
                  </button>
                  <span className="px-6 py-2 font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-r-lg"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  (Stokta {product.stockCount} adet)
                </span>
              </div>
            </div>

            {/* Sepete Ekle Butonları */}
            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-4 rounded-xl font-semibold text-lg transition-all shadow-lg"
              >
                Sepete Ekle - ₺{product.price * quantity}
              </button>
              
              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>Favorilere Ekle</span>
                </button>
                
                <button className="flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  <span>Paylaş</span>
                </button>
              </div>
            </div>

            {/* Güvenlik Bilgileri */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-green-800">Güvenli Alışveriş</h4>
                  <p className="text-sm text-green-600">SSL sertifikası ile korumalı ödeme</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ürün Detayları Tabları */}
        <div className="mt-20">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {[
                { id: 'description', label: 'Açıklama' },
                { id: 'specifications', label: 'Özellikler' },
                { id: 'reviews', label: 'Değerlendirmeler' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {activeTab === 'description' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Ürün Açıklaması</h3>
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">{product.description}</p>
                </div>
                
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">Öne Çıkan Özellikler</h4>
                  <ul className="grid md:grid-cols-2 gap-3">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Teknik Özellikler</h3>
                <div className="bg-white rounded-lg shadow-sm border">
                  {Object.entries(product.specifications).map(([key, value], index) => (
                    <div
                      key={key}
                      className={`flex items-center justify-between px-6 py-4 ${
                        index !== Object.entries(product.specifications).length - 1 ? 'border-b border-gray-100' : ''
                      }`}
                    >
                      <span className="font-medium text-gray-900">{key}</span>
                      <span className="text-gray-700">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Müşteri Değerlendirmeleri</h3>
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    <p className="text-gray-500">Henüz değerlendirme bulunmuyor.</p>
                    <button className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                      İlk Değerlendirmeyi Siz Yapın
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
