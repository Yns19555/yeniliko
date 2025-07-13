'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Sepet ürün tipi
export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
  selectedColor?: string;
  maxStock: number;
}

// Sepet context tipi
interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (product: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // LocalStorage'dan sepeti yükle
  useEffect(() => {
    const savedCart = localStorage.getItem('yeniliko-cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Sepet verisi yüklenirken hata:', error);
      }
    }
  }, []);

  // Sepeti localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('yeniliko-cart', JSON.stringify(items));
  }, [items]);

  // Toplam ürün sayısı
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  // Toplam fiyat
  const totalPrice = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Sepete ürün ekle
  const addToCart = (product: Omit<CartItem, 'quantity'>) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => 
        item.id === product.id && item.selectedColor === product.selectedColor
      );

      if (existingItem) {
        // Ürün zaten sepette varsa miktarını artır
        return currentItems.map(item =>
          item.id === product.id && item.selectedColor === product.selectedColor
            ? { ...item, quantity: Math.min(item.quantity + 1, item.maxStock) }
            : item
        );
      } else {
        // Yeni ürün ekle
        return [...currentItems, { ...product, quantity: 1 }];
      }
    });

    // Sepeti aç
    setIsOpen(true);

    // Başarı bildirimi (isteğe bağlı)
    showNotification('Ürün sepete eklendi!', 'success');
  };

  // Sepetten ürün çıkar
  const removeFromCart = (productId: number) => {
    setItems(currentItems => currentItems.filter(item => item.id !== productId));
    showNotification('Ürün sepetten çıkarıldı!', 'info');
  };

  // Ürün miktarını güncelle
  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems(currentItems =>
      currentItems.map(item =>
        item.id === productId
          ? { ...item, quantity: Math.min(quantity, item.maxStock) }
          : item
      )
    );
  };

  // Sepeti temizle
  const clearCart = () => {
    setItems([]);
    setIsOpen(false);
    showNotification('Sepet temizlendi!', 'info');
  };

  // Sepeti aç
  const openCart = () => setIsOpen(true);

  // Sepeti kapat
  const closeCart = () => setIsOpen(false);

  // Bildirim göster (basit implementasyon)
  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    // Gerçek uygulamada toast notification library kullanılabilir
    console.log(`${type.toUpperCase()}: ${message}`);
  };

  const value: CartContextType = {
    items,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isOpen,
    openCart,
    closeCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// Hook to use cart context
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

// Sepet drawer bileşeni
export function CartDrawer() {
  const { items, totalItems, totalPrice, isOpen, closeCart, updateQuantity, removeFromCart } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-20 z-40"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            Sepetim ({totalItems} ürün)
          </h2>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9m-9 0V19a2 2 0 002 2h7a2 2 0 002-2v-4" />
              </svg>
              <p className="text-gray-500 text-lg">Sepetiniz boş</p>
              <button
                onClick={closeCart}
                className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Alışverişe Başla
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={`${item.id}-${item.selectedColor}`} className="flex items-center space-x-4 bg-gray-50 rounded-lg p-4">
                  {/* Ürün Resmi */}
                  <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center text-2xl border">
                    {item.image}
                  </div>

                  {/* Ürün Bilgileri */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.category}</p>
                    {item.selectedColor && (
                      <p className="text-sm text-gray-500">Renk: {item.selectedColor}</p>
                    )}
                    <p className="text-lg font-bold text-orange-500">₺{item.price}</p>
                  </div>

                  {/* Miktar Kontrolü */}
                  <div className="flex flex-col items-center space-y-2">
                    <div className="flex items-center border border-gray-300 rounded">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Kaldır
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-6 space-y-4">
            <div className="flex items-center justify-between text-xl font-bold">
              <span>Toplam:</span>
              <span className="text-orange-500">₺{totalPrice.toFixed(2)}</span>
            </div>
            
            <div className="space-y-3">
              <a href="/cart" className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-3 rounded-lg font-semibold transition-all block text-center">
                Sepeti Onayla
              </a>
              <button
                onClick={closeCart}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium transition-colors"
              >
                Alışverişe Devam Et
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
