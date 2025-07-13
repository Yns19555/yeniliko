'use client';

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useCart } from "@/contexts/CartContext";
import { useMemo, useCallback } from "react";

// Lazy load Header component
const Header = dynamic(() => import("@/components/Header"), {
  loading: () => <div className="h-20 bg-black animate-pulse" />,
  ssr: true
});

export default function Home() {
  const { addToCart } = useCart();

  const handleAddToCart = useCallback((productData: {
    id: number;
    name: string;
    price: number;
    image: string;
    category: string;
  }) => {
    addToCart({
      id: productData.id,
      name: productData.name,
      price: productData.price,
      image: productData.image,
      category: productData.category,
      maxStock: 10
    });
  }, [addToCart]);
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section id="home" className="bg-gradient-to-br from-black via-gray-900 to-black text-white py-32 overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ff6600\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center bg-orange-500/20 text-orange-500 px-6 py-3 rounded-full text-sm font-medium">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  3D Yazıcı Teknolojisi
                </div>
                <h1 className="text-6xl lg:text-7xl font-black text-white leading-tight">
                  Hayal Ettiğiniz
                  <span className="text-orange-500 block">Tasarımları</span>
                  Gerçeğe Dönüştürün
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
                  Yeniliko ile 3D yazıcı teknolojisinin gücünü keşfedin. Özel tasarımlardan hazır ürünlere, 
                  kaliteli malzemelerle üretilmiş binlerce seçenek sizi bekliyor.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/products" className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-10 py-4 rounded-xl font-semibold text-lg flex items-center justify-center space-x-3 transition-all transform hover:scale-105 shadow-lg">
                  <span>Ürünleri Keşfet</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <button className="border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all">
                  Özel Tasarım Yaptır
                </button>
              </div>

              <div className="flex items-center space-x-12 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">1000+</div>
                  <div className="text-sm text-gray-400 font-medium">Mutlu Müşteri</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">5000+</div>
                  <div className="text-sm text-gray-400 font-medium">Tamamlanan Proje</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">99%</div>
                  <div className="text-sm text-gray-400 font-medium">Memnuniyet Oranı</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-orange-500/20 to-transparent rounded-3xl p-12 backdrop-blur-sm border border-orange-500/20">
                <div className="text-center space-y-8">
                  <div className="text-9xl">🖨️</div>
                  <h3 className="text-3xl font-bold text-white">3D Yazıcı Teknolojisi</h3>
                  <p className="text-gray-300 text-lg">En son teknoloji ile üretim</p>
                  
                  <div className="grid grid-cols-2 gap-6 mt-12">
                    <div className="bg-black/50 rounded-xl p-6 text-center">
                      <svg className="w-10 h-10 text-orange-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <div className="text-white font-semibold">Hızlı Üretim</div>
                    </div>
                    <div className="bg-black/50 rounded-xl p-6 text-center">
                      <svg className="w-10 h-10 text-orange-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                      <div className="text-white font-semibold">Yüksek Kalite</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">Ürün Kategorileri</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              3D yazıcı teknolojisi ile üretilmiş geniş ürün yelpazemizi keşfedin
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-orange-500/10 rounded-3xl flex items-center justify-center mx-auto group-hover:bg-orange-500/20 transition-colors">
                  <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Aksesuarlar</h3>
                <p className="text-gray-600">150+ Ürün</p>
                <div className="pt-4">
                  <span className="text-orange-500 font-semibold group-hover:underline">Keşfet →</span>
                </div>
              </div>
            </div>

            <div className="group bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-orange-500/10 rounded-3xl flex items-center justify-center mx-auto group-hover:bg-orange-500/20 transition-colors">
                  <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Dekorasyon</h3>
                <p className="text-gray-600">200+ Ürün</p>
                <div className="pt-4">
                  <span className="text-orange-500 font-semibold group-hover:underline">Keşfet →</span>
                </div>
              </div>
            </div>

            <div className="group bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-orange-500/10 rounded-3xl flex items-center justify-center mx-auto group-hover:bg-orange-500/20 transition-colors">
                  <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Ofis Ürünleri</h3>
                <p className="text-gray-600">120+ Ürün</p>
                <div className="pt-4">
                  <span className="text-orange-500 font-semibold group-hover:underline">Keşfet →</span>
                </div>
              </div>
            </div>

            <div className="group bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-orange-500/10 rounded-3xl flex items-center justify-center mx-auto group-hover:bg-orange-500/20 transition-colors">
                  <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M9 10V9a2 2 0 012-2h2a2 2 0 012 2v1M9 10H4m11 0h5m-9 0a1 1 0 011-1h2a1 1 0 011 1m-4 0v10a1 1 0 001 1h2a1 1 0 001-1V10" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Oyuncaklar</h3>
                <p className="text-gray-600">80+ Ürün</p>
                <div className="pt-4">
                  <span className="text-orange-500 font-semibold group-hover:underline">Keşfet →</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">Öne Çıkan Ürünler</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              En popüler 3D baskı ürünlerimizi inceleyin ve hemen sipariş verin
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border border-gray-100">
              <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-8xl group-hover:scale-105 transition-transform duration-300">
                📱
              </div>
              
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-orange-500 font-semibold bg-orange-500/10 px-4 py-2 rounded-full">
                    Aksesuarlar
                  </span>
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm text-gray-600">4.8 (124)</span>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-orange-500 transition-colors">
                  Özel Tasarım Telefon Standı
                </h3>
                
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-orange-500">₺45</span>
                  <button
                    onClick={() => handleAddToCart({
                      id: 1,
                      name: 'Özel Tasarım Telefon Standı',
                      price: 45,
                      image: '📱',
                      category: 'Aksesuarlar'
                    })}
                    className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9m-9 0V19a2 2 0 002 2h7a2 2 0 002-2v-4" />
                    </svg>
                    <span>Sepete Ekle</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border border-gray-100">
              <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-8xl group-hover:scale-105 transition-transform duration-300">
                🏺
              </div>

              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-orange-500 font-semibold bg-orange-500/10 px-4 py-2 rounded-full">
                    Dekorasyon
                  </span>
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm text-gray-600">4.9 (89)</span>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-orange-500 transition-colors">
                  Geometrik Vazo Seti
                </h3>

                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-orange-500">₺120</span>
                  <button
                    onClick={() => handleAddToCart({
                      id: 2,
                      name: 'Geometrik Vazo Seti',
                      price: 120,
                      image: '🏺',
                      category: 'Dekorasyon'
                    })}
                    className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9m-9 0V19a2 2 0 002 2h7a2 2 0 002-2v-4" />
                    </svg>
                    <span>Sepete Ekle</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border border-gray-100">
              <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-8xl group-hover:scale-105 transition-transform duration-300">
                ⌨️
              </div>

              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-orange-500 font-semibold bg-orange-500/10 px-4 py-2 rounded-full">
                    Ofis
                  </span>
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm text-gray-600">4.7 (156)</span>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-orange-500 transition-colors">
                  Ergonomik Klavye Desteği
                </h3>

                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-orange-500">₺85</span>
                  <button
                    onClick={() => handleAddToCart({
                      id: 3,
                      name: 'Ergonomik Klavye Desteği',
                      price: 85,
                      image: '⌨️',
                      category: 'Ofis'
                    })}
                    className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9m-9 0V19a2 2 0 002 2h7a2 2 0 002-2v-4" />
                    </svg>
                    <span>Sepete Ekle</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-16">
            <Link href="/products" className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg">
              Tüm Ürünleri Görüntüle
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-white mb-6">Hizmetlerimiz</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              3D tasarım ve üretimde sunduğumuz profesyonel hizmetler
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-gray-800 rounded-3xl p-10 text-center space-y-8 hover:bg-gray-700 transition-all duration-300 hover:-translate-y-2">
              <div className="w-20 h-20 bg-orange-500/20 rounded-3xl flex items-center justify-center mx-auto">
                <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-white">3D Modelleme</h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                Fikirlerinizi profesyonel 3D modellere dönüştürüyoruz. CAD tasarım ve optimizasyon hizmetleri.
              </p>
            </div>

            <div className="bg-gray-800 rounded-3xl p-10 text-center space-y-8 hover:bg-gray-700 transition-all duration-300 hover:-translate-y-2">
              <div className="w-20 h-20 bg-orange-500/20 rounded-3xl flex items-center justify-center mx-auto">
                <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-white">3D Baskı</h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                En son teknoloji 3D yazıcılarla yüksek kaliteli üretim. Çeşitli malzeme seçenekleri.
              </p>
            </div>

            <div className="bg-gray-800 rounded-3xl p-10 text-center space-y-8 hover:bg-gray-700 transition-all duration-300 hover:-translate-y-2">
              <div className="w-20 h-20 bg-orange-500/20 rounded-3xl flex items-center justify-center mx-auto">
                <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-white">Danışmanlık</h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                Projeleriniz için teknik danışmanlık ve tasarım optimizasyonu hizmetleri sunuyoruz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <Image
                  src="/yeniliko-logo.png"
                  alt="Yeniliko Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                  priority
                  sizes="40px"
                />
                <div>
                  <h3 className="text-2xl font-bold">Yeniliko</h3>
                  <p className="text-sm text-orange-500">3D Tasarım & Üretim</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed">
                3D yazıcı teknolojisi ile hayallerinizi gerçeğe dönüştürüyoruz.
                Kaliteli üretim, hızlı teslimat.
              </p>
            </div>

            <div>
              <h4 className="text-xl font-semibold mb-6 text-orange-500">Ürünler</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Aksesuarlar</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Dekorasyon</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Ofis Ürünleri</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Oyuncaklar</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-semibold mb-6 text-orange-500">Hizmetler</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">3D Modelleme</a></li>
                <li><a href="#" className="hover:text-white transition-colors">3D Baskı</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Özel Tasarım</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Danışmanlık</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-semibold mb-6 text-orange-500">İletişim</h4>
              <ul className="space-y-3 text-gray-400">
                <li>info@yeniliko.com</li>
                <li>+90 (212) 555 0123</li>
                <li>İstanbul, Türkiye</li>
                <li className="pt-4">
                  <div className="flex space-x-6">
                    <a href="#" className="hover:text-orange-500 transition-colors">Facebook</a>
                    <a href="#" className="hover:text-orange-500 transition-colors">Instagram</a>
                    <a href="#" className="hover:text-orange-500 transition-colors">LinkedIn</a>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-16 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Yeniliko. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
