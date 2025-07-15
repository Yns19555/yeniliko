"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { withAdminAuth, useAdmin } from "@/contexts/AdminContext";
import RealTimeUserActivity from "@/components/admin/RealTimeUserActivity";

// Mock data
const stats = [
  {
    name: "Toplam Satış",
    value: "₺124,500",
    change: "+12.5%",
    changeType: "increase",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
      </svg>
    ),
  },
  {
    name: "Toplam Sipariş",
    value: "1,247",
    change: "+8.2%",
    changeType: "increase",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    name: "Aktif Ürün",
    value: "156",
    change: "+3.1%",
    changeType: "increase",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    name: "Toplam Kullanıcı",
    value: "5",
    change: "+2 yeni",
    changeType: "increase",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
    ),
  },
];

const recentOrders = [
  { id: "#1247", customer: "Ahmet Yılmaz", product: "Telefon Standı", amount: "₺45", status: "Tamamlandı" },
  { id: "#1246", customer: "Ayşe Kaya", product: "Geometrik Vazo", amount: "₺120", status: "Kargoda" },
  { id: "#1245", customer: "Mehmet Demir", product: "Klavye Desteği", amount: "₺85", status: "Hazırlanıyor" },
  { id: "#1244", customer: "Fatma Şahin", product: "LED Lamba", amount: "₺180", status: "Beklemede" },
  { id: "#1243", customer: "Ali Özkan", product: "Masaüstü Organizer", amount: "₺95", status: "Tamamlandı" },
];

const topProducts = [
  { name: "Özel Tasarım Telefon Standı", sales: 156, revenue: "₺7,020" },
  { name: "Geometrik Vazo Seti", sales: 89, revenue: "₺10,680" },
  { name: "Ergonomik Klavye Desteği", sales: 134, revenue: "₺11,390" },
  { name: "Dekoratif LED Lamba", sales: 67, revenue: "₺12,060" },
  { name: "Modüler Masaüstü Organizer", sales: 98, revenue: "₺9,310" },
];

function AdminDashboard() {
  const [timeRange, setTimeRange] = useState("7d");
  const { user, logActivity } = useAdmin();

  useEffect(() => {
    logActivity('view', 'dashboard');
  }, [logActivity]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Yeniliko Admin Panel - Genel Bakış</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="7d">Son 7 Gün</option>
            <option value="30d">Son 30 Gün</option>
            <option value="90d">Son 90 Gün</option>
            <option value="1y">Son 1 Yıl</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className={`text-sm font-medium ${
                stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
              <span className="text-sm text-gray-500 ml-1">önceki döneme göre</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Satış Grafiği</h3>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm bg-orange-500 text-white rounded-lg">Günlük</button>
              <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Haftalık</button>
              <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Aylık</button>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-gray-500">Satış grafiği burada görünecek</p>
              <p className="text-sm text-gray-400">Chart.js entegrasyonu yapılacak</p>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">En Çok Satan Ürünler</h3>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-semibold text-orange-500">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.sales} satış</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{product.revenue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* User Management */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Kullanıcı Yönetimi</h3>
            <span className="text-2xl">👥</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Toplam Kullanıcı:</span>
              <span className="font-medium">5</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Aktif Kullanıcı:</span>
              <span className="font-medium text-green-600">4</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Pasif Kullanıcı:</span>
              <span className="font-medium text-red-600">1</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Sepetinde Ürün Var:</span>
              <span className="font-medium text-blue-600">3</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <Link
              href="/admin/users"
              className="block w-full bg-orange-500 hover:bg-orange-600 text-white text-center py-2 rounded-lg font-medium transition-colors"
            >
              Kullanıcıları Yönet
            </Link>
          </div>
        </div>

        {/* Recent User Activities */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Son Kullanıcı Aktiviteleri</h3>
            <span className="text-2xl">📋</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <span className="text-lg">🔐</span>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Ahmet Y. giriş yaptı</p>
                <p className="text-xs text-gray-500">2 dakika önce</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-lg">🛒</span>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Ayşe Ö. sepete ürün ekledi</p>
                <p className="text-xs text-gray-500">15 dakika önce</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-lg">✅</span>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Fatma D. sipariş tamamladı</p>
                <p className="text-xs text-gray-500">1 saat önce</p>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <Link
              href="/admin/users"
              className="text-orange-600 hover:text-orange-800 text-sm font-medium"
            >
              Tüm Aktiviteleri Görüntüle →
            </Link>
          </div>
        </div>

        {/* User Stats */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Kullanıcı İstatistikleri</h3>
            <span className="text-2xl">📊</span>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">E-posta Doğrulanmış</span>
                <span className="font-medium">80%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Aktif Kullanıcılar</span>
                <span className="font-medium">80%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Sepetinde Ürün Var</span>
                <span className="font-medium">60%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Son Siparişler</h3>
            <button className="text-orange-500 hover:text-orange-600 font-medium">
              Tümünü Gör
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sipariş No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Müşteri
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ürün
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tutar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.product}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {order.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      order.status === 'Tamamlandı' ? 'bg-green-100 text-green-800' :
                      order.status === 'Kargoda' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'Hazırlanıyor' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Real-Time User Activity Widget */}
      <div className="mt-8">
        <RealTimeUserActivity
          showOnlineUsers={true}
          showUserSessions={false}
          refreshInterval={30000}
        />
      </div>
    </div>
  );
}

export default withAdminAuth(AdminDashboard);
