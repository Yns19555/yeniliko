'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import { useCart } from '@/contexts/CartContext';

// Demo ürün verileri
const products = [
  {
    id: 1,
    name: 'Özel Tasarım Telefon Standı',
    price: 45,
    originalPrice: 60,
    category: 'Aksesuarlar',
    rating: 4.8,
    reviews: 124,
    image: '📱',
    inStock: true,
    isNew: false,
    isBestSeller: true
  },
  {
    id: 2,
    name: 'Geometrik Vazo Seti',
    price: 120,
    originalPrice: null,
    category: 'Dekorasyon',
    rating: 4.9,
    reviews: 89,
    image: '🏺',
    inStock: true,
    isNew: true,
    isBestSeller: false
  },
  {
    id: 3,
    name: 'Ergonomik Klavye Desteği',
    price: 85,
    originalPrice: 100,
    category: 'Ofis',
    rating: 4.7,
    reviews: 156,
    image: '⌨️',
    inStock: true,
    isNew: false,
    isBestSeller: true
  },
  {
    id: 4,
    name: 'Minimalist Masa Lambası',
    price: 200,
    originalPrice: null,
    category: 'Dekorasyon',
    rating: 4.6,
    reviews: 73,
    image: '💡',
    inStock: true,
    isNew: true,
    isBestSeller: false
  },
  {
    id: 5,
    name: 'Özel Tasarım Kalemlik',
    price: 35,
    originalPrice: 45,
    category: 'Ofis',
    rating: 4.5,
    reviews: 92,
    image: '✏️',
    inStock: false,
    isNew: false,
    isBestSeller: false
  },
  {
    id: 6,
    name: 'Dekoratif Duvar Saati',
    price: 150,
    originalPrice: null,
    category: 'Dekorasyon',
    rating: 4.8,
    reviews: 67,
    image: '🕐',
    inStock: true,
    isNew: false,
    isBestSeller: true
  },
  {
    id: 7,
    name: 'Oyuncak Robot Figürü',
    price: 75,
    originalPrice: 90,
    category: 'Oyuncaklar',
    rating: 4.9,
    reviews: 145,
    image: '🤖',
    inStock: true,
    isNew: true,
    isBestSeller: false
  },
  {
    id: 8,
    name: 'Kulaklık Standı',
    price: 55,
    originalPrice: null,
    category: 'Aksesuarlar',
    rating: 4.4,
    reviews: 88,
    image: '🎧',
    inStock: true,
    isNew: false,
    isBestSeller: false
  }
];

const categories = ['Tümü', 'Aksesuarlar', 'Dekorasyon', 'Ofis', 'Oyuncaklar'];
const sortOptions = [
  { value: 'newest', label: 'En Yeni' },
  { value: 'price-low', label: 'Fiyat: Düşükten Yükseğe' },
  { value: 'price-high', label: 'Fiyat: Yüksekten Düşüğe' },
  { value: 'rating', label: 'En Yüksek Puan' },
  { value: 'popular', label: 'En Popüler' }
];

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const { addToCart } = useCart();

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      maxStock: 10 // Demo stock
    });
  };

  // Filtreleme ve sıralama
  const filteredProducts = products
    .filter(product => {
      const matchesCategory = selectedCategory === 'Tümü' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'popular':
          return b.reviews - a.reviews;
        default:
          return b.id - a.id; // newest first
      }
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Header */}
      <div className="bg-gradient-to-r from-black to-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">Ürün Kataloğu</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              3D yazıcı teknolojisi ile üretilmiş kaliteli ürünlerimizi keşfedin
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Filtreler ve Arama */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Arama */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Ürün Ara</label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Ürün adı yazın..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Kategori Filtresi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Kategori</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Sıralama */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Sırala</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Sonuç Sayısı */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-gray-600">
            <span className="font-semibold">{filteredProducts.length}</span> ürün bulundu
          </p>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">Görünüm:</span>
            <button className="p-2 bg-orange-500 text-white rounded-lg">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button className="p-2 bg-gray-200 text-gray-600 rounded-lg">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Ürün Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
              {/* Ürün Resmi */}
              <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-300">
                {product.image}
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col space-y-2">
                  {product.isNew && (
                    <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      YENİ
                    </span>
                  )}
                  {product.isBestSeller && (
                    <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      ÇOK SATAN
                    </span>
                  )}
                  {!product.inStock && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      STOKTA YOK
                    </span>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full shadow-lg">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                  <button className="bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full shadow-lg">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Ürün Bilgileri */}
              <div className="p-6 space-y-4">
                {/* Kategori ve Rating */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-orange-500 font-semibold bg-orange-500/10 px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm text-gray-600">{product.rating} ({product.reviews})</span>
                  </div>
                </div>

                {/* Ürün Adı */}
                <Link href={`/products/${product.id}`}>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-500 transition-colors cursor-pointer line-clamp-2">
                    {product.name}
                  </h3>
                </Link>

                {/* Fiyat ve Sepet */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-orange-500">₺{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">₺{product.originalPrice}</span>
                    )}
                  </div>
                  <button
                    onClick={() => product.inStock && handleAddToCart(product)}
                    disabled={!product.inStock}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                      product.inStock
                        ? 'bg-black hover:bg-gray-800 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9m-9 0V19a2 2 0 002 2h7a2 2 0 002-2v-4" />
                    </svg>
                    <span className="hidden sm:inline">
                      {product.inStock ? 'Sepete Ekle' : 'Stokta Yok'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sayfalama */}
        <div className="flex justify-center mt-16">
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
              Önceki
            </button>
            <button className="px-4 py-2 bg-orange-500 text-white rounded-lg">1</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">2</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">3</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
              Sonraki
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
