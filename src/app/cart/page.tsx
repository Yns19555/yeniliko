'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { useCart } from '@/contexts/CartContext';

export default function CartPage() {
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const shippingCost = totalPrice > 200 ? 0 : 25; // 200 TL üzeri ücretsiz kargo
  const finalTotal = totalPrice + shippingCost - discount;

  const handlePromoCode = () => {
    // Demo promo kodları
    const promoCodes = {
      'YENILIKO10': 0.1, // %10 indirim
      'WELCOME20': 0.2,  // %20 indirim
      'FIRST50': 50      // 50 TL indirim
    };

    const code = promoCode.toUpperCase();
    if (promoCodes[code as keyof typeof promoCodes]) {
      const discountValue = promoCodes[code as keyof typeof promoCodes];
      if (discountValue < 1) {
        // Yüzde indirim
        setDiscount(totalPrice * discountValue);
      } else {
        // Sabit tutar indirim
        setDiscount(Math.min(discountValue, totalPrice));
      }
      alert(`Promosyon kodu uygulandı! ${discountValue < 1 ? `%${discountValue * 100}` : `${discountValue} TL`} indirim`);
    } else {
      alert('Geçersiz promosyon kodu!');
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="text-center">
            <svg className="w-24 h-24 text-gray-300 mx-auto mb-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9m-9 0V19a2 2 0 002 2h7a2 2 0 002-2v-4" />
            </svg>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Sepetiniz Boş</h1>
            <p className="text-gray-600 text-lg mb-8">
              Henüz sepetinize ürün eklemediniz. Hemen alışverişe başlayın!
            </p>
            <Link href="/products" className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-all">
              Ürünleri Keşfet
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Başlık */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sepetim</h1>
          <p className="text-gray-600">{totalItems} ürün sepetinizde</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Sepet Ürünleri */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Header */}
              <div className="bg-gray-50 px-6 py-4 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Ürünler</h2>
                  <button
                    onClick={clearCart}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Sepeti Temizle
                  </button>
                </div>
              </div>

              {/* Ürün Listesi */}
              <div className="divide-y divide-gray-100">
                {items.map((item) => (
                  <div key={`${item.id}-${item.selectedColor}`} className="p-6">
                    <div className="flex items-center space-x-6">
                      {/* Ürün Resmi */}
                      <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center text-3xl border">
                        {item.image}
                      </div>

                      {/* Ürün Bilgileri */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-500 mb-1">{item.category}</p>
                        {item.selectedColor && (
                          <p className="text-sm text-gray-500 mb-2">Renk: {item.selectedColor}</p>
                        )}
                        <p className="text-xl font-bold text-orange-500">₺{item.price}</p>
                      </div>

                      {/* Miktar Kontrolü */}
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-l-lg"
                          >
                            -
                          </button>
                          <span className="px-4 py-2 font-semibold bg-gray-50">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-r-lg"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Toplam Fiyat */}
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">₺{(item.price * item.quantity).toFixed(2)}</p>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 text-sm mt-2"
                        >
                          Kaldır
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Alışverişe Devam Et */}
            <div className="mt-6">
              <Link href="/products" className="inline-flex items-center text-orange-500 hover:text-orange-600 font-medium">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Alışverişe Devam Et
              </Link>
            </div>
          </div>

          {/* Sipariş Özeti */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Sipariş Özeti</h2>

              {/* Promosyon Kodu */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promosyon Kodu
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Kod girin"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <button
                    onClick={handlePromoCode}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Uygula
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Demo kodlar: YENILIKO10, WELCOME20, FIRST50
                </p>
              </div>

              {/* Fiyat Detayları */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ara Toplam ({totalItems} ürün)</span>
                  <span className="font-semibold">₺{totalPrice.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Kargo</span>
                  <span className="font-semibold">
                    {shippingCost === 0 ? (
                      <span className="text-green-600">Ücretsiz</span>
                    ) : (
                      `₺${shippingCost.toFixed(2)}`
                    )}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>İndirim</span>
                    <span className="font-semibold">-₺{discount.toFixed(2)}</span>
                  </div>
                )}

                {totalPrice < 200 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-700">
                      ₺{(200 - totalPrice).toFixed(2)} daha ekleyin, ücretsiz kargo kazanın!
                    </p>
                  </div>
                )}
              </div>

              {/* Toplam */}
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900">Toplam</span>
                  <span className="text-2xl font-bold text-orange-500">₺{finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Ödeme Butonu */}
              <Link
                href="/checkout"
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-4 rounded-xl font-semibold text-lg transition-all shadow-lg text-center block"
              >
                Ödemeye Geç
              </Link>

              {/* Güvenlik Bilgileri */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>SSL ile güvenli ödeme</span>
                </div>
                
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>30 gün iade garantisi</span>
                </div>
                
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Hızlı teslimat</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
