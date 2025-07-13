'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const { user, logout, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: ''
  });

  // User bilgileri yüklendiğinde form'u güncelle
  useEffect(() => {
    if (user) {
      setEditForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        email: user.email || ''
      });
    }
  }, [user]);

  // Demo sipariş verileri
  const demoOrders = [
    {
      id: 'YNL240001',
      date: '2024-07-10',
      status: 'delivered',
      total: 165,
      items: [
        { name: 'Özel Tasarım Telefon Standı', quantity: 1, price: 45 },
        { name: 'Geometrik Vazo Seti', quantity: 1, price: 120 }
      ]
    },
    {
      id: 'YNL240002',
      date: '2024-07-08',
      status: 'shipped',
      total: 85,
      items: [
        { name: 'Ergonomik Klavye Desteği', quantity: 1, price: 85 }
      ]
    },
    {
      id: 'YNL240003',
      date: '2024-07-05',
      status: 'processing',
      total: 200,
      items: [
        { name: 'Minimalist Masa Lambası', quantity: 1, price: 200 }
      ]
    }
  ];

  // Demo favori ürünler
  const favoriteProducts = [
    { id: 1, name: 'Özel Tasarım Telefon Standı', price: 45, image: '📱' },
    { id: 2, name: 'Geometrik Vazo Seti', price: 120, image: '🏺' },
    { id: 4, name: 'Minimalist Masa Lambası', price: 200, image: '💡' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return 'Teslim Edildi';
      case 'shipped': return 'Kargoda';
      case 'processing': return 'Hazırlanıyor';
      case 'cancelled': return 'İptal Edildi';
      default: return 'Bilinmiyor';
    }
  };

  const handleProfileUpdate = async () => {
    const result = await updateProfile(editForm);
    if (result.success) {
      setIsEditing(false);
      alert('Profil başarıyla güncellendi!');
    } else {
      alert(result.message);
    }
  };

  return (
    <ProtectedRoute requireAuth={true}>
      <div className="min-h-screen bg-gray-50">
        <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Hoş Geldiniz, {user?.firstName || 'Kullanıcı'}! 👋
              </h1>
              <p className="text-orange-100">
                Hesabınızı yönetin ve siparişlerinizi takip edin
              </p>
            </div>
            <div className="text-right">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold mb-2">
                {user?.firstName?.charAt(0) || 'U'}{user?.lastName?.charAt(0) || 'S'}
              </div>
              {user?.role === 'admin' && (
                <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
                  Admin
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <nav className="space-y-2">
                {[
                  { id: 'overview', label: 'Genel Bakış', icon: '📊' },
                  { id: 'orders', label: 'Siparişlerim', icon: '📦' },
                  { id: 'favorites', label: 'Favorilerim', icon: '❤️' },
                  { id: 'profile', label: 'Profil Ayarları', icon: '👤' },
                  { id: 'addresses', label: 'Adreslerim', icon: '📍' },
                  { id: 'security', label: 'Güvenlik', icon: '🔒' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === item.id
                        ? 'bg-orange-50 text-orange-600 border-l-4 border-orange-500'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>

              {user?.role === 'admin' && (
                <div className="mt-6 pt-6 border-t">
                  <Link
                    href="/admin"
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors bg-red-50 text-red-600 hover:bg-red-100"
                  >
                    <span className="text-lg">⚙️</span>
                    <span className="font-medium">Admin Panel</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Genel Bakış</h2>
                  
                  {/* Stats Cards */}
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-100 text-sm">Toplam Sipariş</p>
                          <p className="text-3xl font-bold">{demoOrders.length}</p>
                        </div>
                        <div className="text-3xl">📦</div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-100 text-sm">Toplam Harcama</p>
                          <p className="text-3xl font-bold">₺{demoOrders.reduce((sum, order) => sum + order.total, 0)}</p>
                        </div>
                        <div className="text-3xl">💰</div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-100 text-sm">Favori Ürün</p>
                          <p className="text-3xl font-bold">{favoriteProducts.length}</p>
                        </div>
                        <div className="text-3xl">❤️</div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Orders */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Son Siparişler</h3>
                    <div className="space-y-4">
                      {demoOrders.slice(0, 3).map((order) => (
                        <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-4">
                              <span className="font-semibold text-gray-900">#{order.id}</span>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                {getStatusText(order.status)}
                              </span>
                            </div>
                            <span className="font-bold text-orange-500">₺{order.total}</span>
                          </div>
                          <p className="text-sm text-gray-600">{order.date}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Hızlı İşlemler</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Link href="/products" className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-2xl">
                          🛍️
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Alışverişe Devam Et</h4>
                          <p className="text-sm text-gray-600">Yeni ürünleri keşfet</p>
                        </div>
                      </Link>
                      
                      <button 
                        onClick={() => setActiveTab('orders')}
                        className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                          📋
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Siparişleri Görüntüle</h4>
                          <p className="text-sm text-gray-600">Tüm siparişlerinizi inceleyin</p>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Siparişlerim</h2>
                  
                  <div className="space-y-6">
                    {demoOrders.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <h3 className="text-lg font-semibold text-gray-900">Sipariş #{order.id}</h3>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                              {getStatusText(order.status)}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-orange-500">₺{order.total}</p>
                            <p className="text-sm text-gray-600">{order.date}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                              <div>
                                <p className="font-medium text-gray-900">{item.name}</p>
                                <p className="text-sm text-gray-600">Adet: {item.quantity}</p>
                              </div>
                              <p className="font-semibold text-gray-900">₺{item.price}</p>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex space-x-3 mt-4">
                          <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                            Detayları Görüntüle
                          </button>
                          {order.status === 'delivered' && (
                            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                              Tekrar Sipariş Ver
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Favorites Tab */}
              {activeTab === 'favorites' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Favori Ürünlerim</h2>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteProducts.map((product) => (
                      <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                        <div className="text-center mb-4">
                          <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-3xl mx-auto mb-3">
                            {product.image}
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                          <p className="text-xl font-bold text-orange-500">₺{product.price}</p>
                        </div>
                        
                        <div className="space-y-2">
                          <Link 
                            href={`/products/${product.id}`}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg text-sm font-medium transition-colors block text-center"
                          >
                            Ürünü Görüntüle
                          </Link>
                          <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-medium transition-colors">
                            Favorilerden Çıkar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Profil Ayarları</h2>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      {isEditing ? 'İptal' : 'Düzenle'}
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ad</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.firstName}
                            onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900 font-medium">{user?.firstName || 'Belirtilmemiş'}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Soyad</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.lastName}
                            onChange={(e) => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900 font-medium">{user?.lastName || 'Belirtilmemiş'}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
                        <p className="text-gray-900 font-medium">{user?.email || 'Belirtilmemiş'}</p>
                        <p className="text-xs text-gray-500 mt-1">E-posta adresi değiştirilemez</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                        {isEditing ? (
                          <input
                            type="tel"
                            value={editForm.phone}
                            onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="+90 (555) 123 45 67"
                          />
                        ) : (
                          <p className="text-gray-900 font-medium">{user?.phone || 'Belirtilmemiş'}</p>
                        )}
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex space-x-4">
                        <button
                          onClick={handleProfileUpdate}
                          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                          Kaydet
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                          İptal
                        </button>
                      </div>
                    )}

                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Hesap Bilgileri</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Hesap Türü:</span>
                          <span className="font-medium text-gray-900 capitalize">{user?.role || 'Bilinmiyor'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Üyelik Tarihi:</span>
                          <span className="font-medium text-gray-900">
                            {user?.createdAt ? new Date(user?.createdAt).toLocaleDateString('tr-TR') : 'Bilinmiyor'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">E-posta Doğrulandı:</span>
                          <span className={`font-medium ${user?.emailVerified ? 'text-green-600' : 'text-red-600'}`}>
                            {user?.emailVerified ? 'Evet' : 'Hayır'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Other tabs placeholder */}
              {['addresses', 'security'].includes(activeTab) && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🚧</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Yakında Gelecek</h3>
                  <p className="text-gray-600">Bu özellik şu anda geliştiriliyor.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}
