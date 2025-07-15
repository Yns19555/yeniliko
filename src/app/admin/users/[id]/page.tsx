'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import UserActivityTracker from '@/components/admin/UserActivityTracker';
import RealTimeUserActivity from '@/components/admin/RealTimeUserActivity';
import { supabase } from '@/lib/supabase';

// User interface tanımı
interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  lastLogin: string | null;
  totalOrders: number;
  totalSpent: number;
  cartItems: any[];
  orders: any[];
  activities: any[];
  address: {
    street: string;
    city: string;
    district: string;
    zipCode: string;
    country: string;
  };
}

// Supabase'den kullanıcı verisi çek
const getUserById = async (id: string): Promise<UserData | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('User fetch error:', error);
      return null;
    }

    // Supabase verisini frontend formatına dönüştür
    if (data) {
      return {
        id: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        phone: data.phone || '',
        role: data.role.toLowerCase(),
        isActive: data.is_active,
        emailVerified: data.email_verified,
        createdAt: data.created_at,
        lastLogin: data.last_login,
        totalOrders: 0, // Bu bilgiler orders tablosundan gelecek
        totalSpent: 0,
        cartItems: [], // Bu bilgiler cart tablosundan gelecek
        orders: [], // Bu bilgiler orders tablosundan gelecek
        activities: [
          {
            type: 'register',
            description: 'Hesap oluşturdu',
            timestamp: data.created_at,
            ip: '127.0.0.1'
          }
        ],
        address: {
          street: '',
          city: '',
          district: '',
          zipCode: '',
          country: 'Türkiye'
        }
      };
    }

    return null;
  } catch (error) {
    console.error('User fetch failed:', error);
    return null;
  }
};

// Demo kullanıcı verisi (fallback için)
const getDemoUserById = (id: string): UserData | null => {
  const demoUsers = [
    {
      id: '1',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@yeniliko.com',
      phone: '+90 555 123 45 67',
      role: 'admin',
      isActive: true,
      emailVerified: true,
      createdAt: '2024-01-01T00:00:00Z',
      lastLogin: '2024-07-12T10:30:00Z',
      totalOrders: 0,
      totalSpent: 0,
      avatar: null,
      address: {
        street: 'Admin Caddesi No:1',
        city: 'İstanbul',
        district: 'Kadıköy',
        zipCode: '34710',
        country: 'Türkiye'
      },
      cartItems: [],
      orders: [],
      activities: [
        { type: 'login', description: 'Admin paneline giriş yaptı', timestamp: '2024-07-12T10:30:00Z', ip: '192.168.1.100' },
        { type: 'user_view', description: 'Kullanıcı listesini görüntüledi', timestamp: '2024-07-12T10:25:00Z', ip: '192.168.1.100' }
      ]
    },
    {
      id: '2',
      firstName: 'Ahmet',
      lastName: 'Yılmaz',
      email: 'ahmet@example.com',
      phone: '+90 555 987 65 43',
      role: 'user',
      isActive: true,
      emailVerified: true,
      createdAt: '2024-01-15T00:00:00Z',
      lastLogin: '2024-07-12T09:15:00Z',
      totalOrders: 5,
      totalSpent: 1250,
      avatar: null,
      address: {
        street: 'Atatürk Caddesi No:45',
        city: 'Ankara',
        district: 'Çankaya',
        zipCode: '06100',
        country: 'Türkiye'
      },
      cartItems: [
        { id: 1, name: 'Özel Tasarım Telefon Standı', price: 45, quantity: 2, addedAt: '2024-07-12T09:00:00Z' },
        { id: 3, name: 'Minimalist Masa Lambası', price: 200, quantity: 1, addedAt: '2024-07-12T09:10:00Z' }
      ],
      orders: [
        {
          id: 'YNL240005',
          date: '2024-07-11T14:30:00Z',
          status: 'delivered',
          total: 320,
          items: [
            { name: 'Geometrik Vazo Seti', price: 120, quantity: 1 },
            { name: 'Ergonomik Klavye Desteği', price: 85, quantity: 1 },
            { name: 'Kargo', price: 15, quantity: 1 }
          ]
        },
        {
          id: 'YNL240003',
          date: '2024-07-08T11:15:00Z',
          status: 'delivered',
          total: 165,
          items: [
            { name: 'Özel Tasarım Telefon Standı', price: 45, quantity: 2 },
            { name: 'Modern Duvar Saati', price: 75, quantity: 1 }
          ]
        }
      ],
      activities: [
        { type: 'login', description: 'Siteye giriş yaptı', timestamp: '2024-07-12T09:15:00Z', ip: '192.168.1.105' },
        { type: 'cart_add', description: 'Sepete ürün ekledi: Minimalist Masa Lambası', timestamp: '2024-07-12T09:10:00Z', ip: '192.168.1.105' },
        { type: 'product_view', description: 'Ürün görüntüledi: Geometrik Vazo Seti', timestamp: '2024-07-12T09:05:00Z', ip: '192.168.1.105' },
        { type: 'order_complete', description: 'Sipariş tamamladı: #YNL240005', timestamp: '2024-07-11T14:30:00Z', ip: '192.168.1.105' },
        { type: 'payment_success', description: 'Ödeme başarılı: ₺320', timestamp: '2024-07-11T14:25:00Z', ip: '192.168.1.105' },
        { type: 'cart_checkout', description: 'Sepeti onayladı', timestamp: '2024-07-11T14:20:00Z', ip: '192.168.1.105' }
      ]
    },
    {
      id: '3',
      firstName: 'Mehmet',
      lastName: 'Demir',
      email: 'mehmet@example.com',
      phone: '+90 555 111 22 33',
      role: 'user',
      isActive: true,
      emailVerified: true,
      createdAt: '2024-02-01T00:00:00Z',
      lastLogin: '2024-07-12T08:45:00Z',
      totalOrders: 2,
      totalSpent: 450,
      avatar: null,
      address: {
        street: 'Atatürk Caddesi No:25',
        city: 'Ankara',
        district: 'Çankaya',
        zipCode: '06100',
        country: 'Türkiye'
      },
      cartItems: [],
      orders: [],
      activities: [
        { type: 'login', description: 'Siteye giriş yaptı', timestamp: '2024-07-12T08:45:00Z', ip: '192.168.1.110' },
        { type: 'product_view', description: 'Ürün görüntüledi: Modern Sandalye', timestamp: '2024-07-12T08:40:00Z', ip: '192.168.1.110' }
      ]
    },
    {
      id: '4',
      firstName: 'Ayşe',
      lastName: 'Kaya',
      email: 'ayse@example.com',
      phone: '+90 555 444 55 66',
      role: 'manager',
      isActive: true,
      emailVerified: true,
      createdAt: '2024-01-20T00:00:00Z',
      lastLogin: '2024-07-12T11:00:00Z',
      totalOrders: 8,
      totalSpent: 2100,
      avatar: null,
      address: {
        street: 'İnönü Bulvarı No:45',
        city: 'İzmir',
        district: 'Konak',
        zipCode: '35100',
        country: 'Türkiye'
      },
      cartItems: [],
      orders: [],
      activities: [
        { type: 'login', description: 'Yönetici paneline giriş yaptı', timestamp: '2024-07-12T11:00:00Z', ip: '192.168.1.115' },
        { type: 'user_view', description: 'Kullanıcı listesini görüntüledi', timestamp: '2024-07-12T10:55:00Z', ip: '192.168.1.115' }
      ]
    }
  ];

  return demoUsers.find(user => user.id === id) || null;
};

export default function AdminUserDetailPage() {
  const params = useParams();
  const userId = params.id as string;
  const [user, setUser] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      try {
        // Önce Supabase'den dene
        let userData = await getUserById(userId);

        // Eğer Supabase'de bulunamazsa demo verilerden dene
        if (!userData) {
          userData = getDemoUserById(userId);
        }

        setUser(userData);
      } catch (error) {
        console.error('Failed to load user:', error);
        // Hata durumunda demo verilerden dene
        const userData = getDemoUserById(userId);
        setUser(userData);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadUser();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Kullanıcı bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">❌</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Kullanıcı Bulunamadı</h2>
        <p className="text-gray-600 mb-6">Aradığınız kullanıcı mevcut değil.</p>
        <Link
          href="/admin/users"
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Kullanıcı Listesine Dön
        </Link>
      </div>
    );
  }

  const toggleUserStatus = () => {
    setUser({ ...user, isActive: !user.isActive });
  };

  const getStatusBadge = () => {
    if (!user.isActive) {
      return <span className="px-3 py-1 text-sm font-medium bg-red-100 text-red-800 rounded-full">Pasif</span>;
    }
    if (!user.emailVerified) {
      return <span className="px-3 py-1 text-sm font-medium bg-yellow-100 text-yellow-800 rounded-full">E-posta Doğrulanmamış</span>;
    }
    return <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">Aktif</span>;
  };

  const getRoleBadge = () => {
    const colors = {
      admin: 'bg-purple-100 text-purple-800',
      manager: 'bg-blue-100 text-blue-800',
      user: 'bg-gray-100 text-gray-800'
    };
    
    const labels = {
      admin: 'Admin',
      manager: 'Yönetici',
      user: 'Kullanıcı'
    };

    return (
      <span className={`px-3 py-1 text-sm font-medium rounded-full ${colors[user.role as keyof typeof colors]}`}>
        {labels[user.role as keyof typeof labels]}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityIcon = (type: string) => {
    const icons = {
      login: '🔐',
      logout: '🚪',
      register: '📝',
      cart_add: '🛒',
      cart_remove: '🗑️',
      cart_checkout: '💳',
      order_complete: '✅',
      order_cancel: '❌',
      payment_success: '💰',
      payment_failed: '💸',
      product_view: '👁️',
      profile_update: '✏️',
      password_change: '🔑',
      email_verify: '📧',
      user_view: '👤',
      account_deactivate: '🔒'
    };
    return icons[type as keyof typeof icons] || '📋';
  };

  const tabs = [
    { id: 'overview', name: 'Genel Bakış', icon: '📊' },
    { id: 'orders', name: 'Siparişler', icon: '📦' },
    { id: 'cart', name: 'Sepet', icon: '🛒' },
    { id: 'activities', name: 'Aktiviteler', icon: '📋' },
    { id: 'settings', name: 'Ayarlar', icon: '⚙️' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/users"
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleUserStatus}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              user.isActive
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {user.isActive ? 'Pasifleştir' : 'Aktifleştir'}
          </button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            Mesaj Gönder
          </button>
        </div>
      </div>

      {/* User Info Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start space-x-6">
          <div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {user.firstName?.charAt(0) || 'U'}{user.lastName?.charAt(0) || 'U'}
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-bold text-black mb-3">Kişisel Bilgiler</h3>
                <div className="space-y-2">
                  <p className="text-black"><span className="font-bold text-black">Ad Soyad:</span> {user.firstName || 'Belirtilmemiş'} {user.lastName || ''}</p>
                  <p className="text-black"><span className="font-bold text-black">E-posta:</span> {user.email || 'Belirtilmemiş'}</p>
                  <p className="text-black"><span className="font-bold text-black">Telefon:</span> {user.phone || 'Belirtilmemiş'}</p>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-black">Rol:</span>
                    {getRoleBadge()}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-black">Durum:</span>
                    {getStatusBadge()}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-black mb-3">İstatistikler</h3>
                <div className="space-y-2">
                  <p className="text-black"><span className="font-bold text-black">Toplam Sipariş:</span> {user.totalOrders || 0}</p>
                  <p className="text-black"><span className="font-bold text-black">Toplam Harcama:</span> ₺{user.totalSpent || 0}</p>
                  <p className="text-black"><span className="font-bold text-black">Sepetteki Ürün:</span> {user.cartItems?.length || 0}</p>
                  <p className="text-black"><span className="font-bold text-black">Kayıt Tarihi:</span> {user.createdAt ? formatDate(user.createdAt) : 'Belirtilmemiş'}</p>
                  <p className="text-black"><span className="font-bold text-black">Son Giriş:</span> {user.lastLogin ? formatDate(user.lastLogin) : 'Hiç'}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-black mb-3">Adres Bilgileri</h3>
                <div className="space-y-1">
                  <p className="text-black font-medium">{user.address.street}</p>
                  <p className="text-black font-medium">{user.address.district}, {user.address.city}</p>
                  <p className="text-black font-medium">{user.address.zipCode}</p>
                  <p className="text-black font-medium">{user.address.country}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-bold text-black mb-4">Son Aktiviteler</h3>
                <div className="space-y-3">
                  {user.activities?.slice(0, 5).map((activity: any, index: number) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <span className="text-xl">{getActivityIcon(activity.type)}</span>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-black">{activity.description || 'Aktivite açıklaması yok'}</p>
                        <p className="text-xs font-medium text-gray-700">{activity.timestamp ? formatDate(activity.timestamp) : 'Tarih belirtilmemiş'}</p>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-black">
                      <p className="font-medium">Henüz aktivite bulunmuyor</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-black mb-4">Hızlı İstatistikler</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{user.totalOrders}</div>
                    <div className="text-sm text-blue-600">Toplam Sipariş</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">₺{user.totalSpent}</div>
                    <div className="text-sm text-green-600">Toplam Harcama</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{user.cartItems.length}</div>
                    <div className="text-sm text-purple-600">Sepetteki Ürün</div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {user.cartItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)}₺
                    </div>
                    <div className="text-sm text-orange-600">Sepet Değeri</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div>
              <h3 className="text-lg font-bold text-black mb-4">Sipariş Geçmişi</h3>
              {user.orders.length > 0 ? (
                <div className="space-y-4">
                  {user.orders.map((order: any) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-bold text-black">Sipariş #{order.id}</h4>
                          <p className="text-sm font-medium text-gray-700">{formatDate(order.date)}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-black">₺{order.total}</div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status === 'delivered' ? 'Teslim Edildi' : 'Beklemede'}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {order.items.map((item: any, index: number) => (
                          <div key={index} className="flex justify-between text-sm font-medium text-black">
                            <span>{item.name} x{item.quantity}</span>
                            <span>₺{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📦</div>
                  <p className="font-medium text-black">Henüz sipariş bulunmuyor.</p>
                </div>
              )}
            </div>
          )}

          {/* Cart Tab */}
          {activeTab === 'cart' && (
            <div>
              <h3 className="text-lg font-bold text-black mb-4">Sepet İçeriği</h3>
              {user.cartItems.length > 0 ? (
                <div className="space-y-4">
                  {user.cartItems.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600">
                          Sepete eklenme: {formatDate(item.addedAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          {item.quantity} x ₺{item.price} = ₺{item.quantity * item.price}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Toplam:</span>
                      <span>₺{user.cartItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🛒</div>
                  <p className="text-gray-600">Sepet boş.</p>
                </div>
              )}
            </div>
          )}

          {/* Activities Tab */}
          {activeTab === 'activities' && (
            <div>
              <RealTimeUserActivity
                userId={user.id}
                showOnlineUsers={false}
                showUserSessions={true}
                refreshInterval={15000}
              />
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div>
              <h3 className="text-lg font-bold text-black mb-4">Kullanıcı Ayarları</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">Ad</label>
                    <input
                      type="text"
                      value={user.firstName}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">Soyad</label>
                    <input
                      type="text"
                      value={user.lastName}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">E-posta</label>
                    <input
                      type="email"
                      value={user.email}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                    <input
                      type="tel"
                      value={user.phone}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      readOnly
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="text-md font-bold text-black mb-4">Kullanıcı Aktiviteleri</h4>
                  <UserActivityTracker
                    userId={user.id}
                    userName={`${user.firstName || 'Kullanıcı'} ${user.lastName || ''}`}
                    showOnlineUsers={false}
                    maxActivities={50}
                  />
                </div>

                <div className="border-t pt-6 mt-6">
                  <h4 className="text-md font-bold text-black mb-4">Tehlikeli İşlemler</h4>
                  <div className="space-y-3">
                    <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                      Şifre Sıfırlama E-postası Gönder
                    </button>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                      Kullanıcıyı Sil
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
