'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

// Demo kullanıcı verileri (gerçek uygulamada API'den gelecek)
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
    cartItems: [],
    activities: [
      { type: 'login', description: 'Admin paneline giriş yaptı', timestamp: '2024-07-12T10:30:00Z' },
      { type: 'user_view', description: 'Kullanıcı listesini görüntüledi', timestamp: '2024-07-12T10:25:00Z' }
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
    cartItems: [
      { id: 1, name: 'Özel Tasarım Telefon Standı', price: 45, quantity: 2 },
      { id: 3, name: 'Minimalist Masa Lambası', price: 200, quantity: 1 }
    ],
    activities: [
      { type: 'login', description: 'Siteye giriş yaptı', timestamp: '2024-07-12T09:15:00Z' },
      { type: 'cart_add', description: 'Sepete ürün ekledi: Minimalist Masa Lambası', timestamp: '2024-07-12T09:10:00Z' },
      { type: 'product_view', description: 'Ürün görüntüledi: Geometrik Vazo Seti', timestamp: '2024-07-12T09:05:00Z' },
      { type: 'order_complete', description: 'Sipariş tamamladı: #YNL240005', timestamp: '2024-07-11T14:30:00Z' }
    ]
  },
  {
    id: '3',
    firstName: 'Fatma',
    lastName: 'Demir',
    email: 'fatma@example.com',
    phone: '+90 555 456 78 90',
    role: 'user',
    isActive: true,
    emailVerified: false,
    createdAt: '2024-02-20T00:00:00Z',
    lastLogin: '2024-07-11T16:45:00Z',
    totalOrders: 2,
    totalSpent: 320,
    cartItems: [
      { id: 2, name: 'Ergonomik Klavye Desteği', price: 85, quantity: 1 }
    ],
    activities: [
      { type: 'login', description: 'Siteye giriş yaptı', timestamp: '2024-07-11T16:45:00Z' },
      { type: 'cart_add', description: 'Sepete ürün ekledi: Ergonomik Klavye Desteği', timestamp: '2024-07-11T16:40:00Z' },
      { type: 'register', description: 'Hesap oluşturdu', timestamp: '2024-02-20T10:00:00Z' }
    ]
  },
  {
    id: '4',
    firstName: 'Mehmet',
    lastName: 'Kaya',
    email: 'mehmet@example.com',
    phone: '+90 555 321 54 87',
    role: 'user',
    isActive: false,
    emailVerified: true,
    createdAt: '2024-03-10T00:00:00Z',
    lastLogin: '2024-06-15T12:20:00Z',
    totalOrders: 1,
    totalSpent: 45,
    cartItems: [],
    activities: [
      { type: 'account_deactivate', description: 'Hesap deaktive edildi', timestamp: '2024-06-20T10:00:00Z' },
      { type: 'login', description: 'Siteye giriş yaptı', timestamp: '2024-06-15T12:20:00Z' },
      { type: 'order_complete', description: 'Sipariş tamamladı: #YNL240001', timestamp: '2024-03-15T11:30:00Z' }
    ]
  },
  {
    id: '5',
    firstName: 'Ayşe',
    lastName: 'Özkan',
    email: 'ayse@example.com',
    phone: '+90 555 654 32 10',
    role: 'user',
    isActive: true,
    emailVerified: true,
    createdAt: '2024-04-05T00:00:00Z',
    lastLogin: '2024-07-12T08:30:00Z',
    totalOrders: 8,
    totalSpent: 2100,
    cartItems: [
      { id: 1, name: 'Özel Tasarım Telefon Standı', price: 45, quantity: 1 },
      { id: 4, name: 'Geometrik Vazo Seti', price: 120, quantity: 2 },
      { id: 5, name: 'Modern Duvar Saati', price: 150, quantity: 1 }
    ],
    activities: [
      { type: 'login', description: 'Siteye giriş yaptı', timestamp: '2024-07-12T08:30:00Z' },
      { type: 'cart_add', description: 'Sepete ürün ekledi: Modern Duvar Saati', timestamp: '2024-07-12T08:25:00Z' },
      { type: 'product_view', description: 'Ürün görüntüledi: Modern Duvar Saati', timestamp: '2024-07-12T08:20:00Z' },
      { type: 'order_complete', description: 'Sipariş tamamladı: #YNL240012', timestamp: '2024-07-10T15:45:00Z' }
    ]
  }
];

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Kullanıcıları API'den yükle
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/admin/users');
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          console.error('Kullanıcılar yüklenemedi');
          setUsers(demoUsers); // Fallback to demo data
        }
      } catch (error) {
        console.error('API error:', error);
        setUsers(demoUsers); // Fallback to demo data
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filtreleme ve arama
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);

    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && user.isActive) ||
      (filterStatus === 'inactive' && !user.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Sıralama
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'name':
        aValue = `${a.firstName} ${a.lastName}`;
        bValue = `${b.firstName} ${b.lastName}`;
        break;
      case 'email':
        aValue = a.email;
        bValue = b.email;
        break;
      case 'totalOrders':
        aValue = a.totalOrders;
        bValue = b.totalOrders;
        break;
      case 'totalSpent':
        aValue = a.totalSpent;
        bValue = b.totalSpent;
        break;
      case 'lastLogin':
        aValue = new Date(a.lastLogin || 0).getTime();
        bValue = new Date(b.lastLogin || 0).getTime();
        break;
      default:
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, isActive: !user.isActive }
        : user
    ));
  };

  const getStatusBadge = (user: any) => {
    if (!user.isActive) {
      return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Pasif</span>;
    }
    if (!user.emailVerified) {
      return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">E-posta Doğrulanmamış</span>;
    }
    return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Aktif</span>;
  };

  const getRoleBadge = (role: string) => {
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
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[role as keyof typeof colors]}`}>
        {labels[role as keyof typeof labels]}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Kullanıcılar yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kullanıcı Yönetimi</h1>
          <p className="text-gray-600">Tüm kullanıcıları görüntüleyin ve yönetin ({users.length} kullanıcı)</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            📊 Rapor Al
          </button>
          <Link
            href="/admin/users/new"
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            + Yeni Kullanıcı
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Toplam Kullanıcı</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Aktif Kullanıcı</p>
              <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.isActive).length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-2xl">📧</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">E-posta Doğrulanmamış</p>
              <p className="text-2xl font-bold text-gray-900">{users.filter(u => !u.emailVerified).length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-2xl">🛒</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Sepetinde Ürün Var</p>
              <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.cartItems.length > 0).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Arama</label>
            <input
              type="text"
              placeholder="Ad, e-posta veya telefon..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Role Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">Tümü</option>
              <option value="admin">Admin</option>
              <option value="manager">Yönetici</option>
              <option value="user">Kullanıcı</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Durum</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">Tümü</option>
              <option value="active">Aktif</option>
              <option value="inactive">Pasif</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sırala</label>
            <div className="flex space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="createdAt">Kayıt Tarihi</option>
                <option value="name">Ad Soyad</option>
                <option value="email">E-posta</option>
                <option value="lastLogin">Son Giriş</option>
                <option value="totalOrders">Sipariş Sayısı</option>
                <option value="totalSpent">Toplam Harcama</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kullanıcı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İletişim
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol & Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aktivite
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sepet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          Kayıt: {formatDate(user.createdAt)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                    <div className="text-sm text-gray-500">{user.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      {getRoleBadge(user.role)}
                      {getStatusBadge(user)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user.totalOrders} sipariş
                    </div>
                    <div className="text-sm text-gray-500">
                      ₺{user.totalSpent} harcama
                    </div>
                    <div className="text-sm text-gray-500">
                      Son giriş: {user.lastLogin ? formatDate(user.lastLogin) : 'Hiç'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user.cartItems.length} ürün
                    </div>
                    {user.cartItems.length > 0 && (
                      <div className="text-sm text-gray-500">
                        ₺{user.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)} değer
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="text-orange-600 hover:text-orange-900"
                    >
                      Detay
                    </Link>
                    <button
                      onClick={() => toggleUserStatus(user.id)}
                      className={`${
                        user.isActive 
                          ? 'text-red-600 hover:text-red-900' 
                          : 'text-green-600 hover:text-green-900'
                      }`}
                    >
                      {user.isActive ? 'Pasifleştir' : 'Aktifleştir'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results Info */}
      <div className="text-sm text-gray-600">
        {sortedUsers.length} kullanıcı gösteriliyor (toplam {users.length} kullanıcı)
      </div>
    </div>
  );
}
