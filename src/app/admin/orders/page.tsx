"use client";

import { useState } from "react";

interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  products: {
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: string;
  paymentStatus: string;
  shippingAddress: string;
  orderDate: string;
  deliveryDate: string | null;
}

// Mock data
const orders = [
  {
    id: "#1247",
    customer: {
      name: "Ahmet Yılmaz",
      email: "ahmet@email.com",
      phone: "+90 532 123 4567"
    },
    products: [
      { name: "Telefon Standı", quantity: 2, price: 45 }
    ],
    total: 90,
    status: "Tamamlandı",
    paymentStatus: "Ödendi",
    shippingAddress: "İstanbul, Kadıköy",
    orderDate: "2024-01-20",
    deliveryDate: "2024-01-22"
  },
  {
    id: "#1246",
    customer: {
      name: "Ayşe Kaya",
      email: "ayse@email.com",
      phone: "+90 533 234 5678"
    },
    products: [
      { name: "Geometrik Vazo", quantity: 1, price: 120 }
    ],
    total: 120,
    status: "Kargoda",
    paymentStatus: "Ödendi",
    shippingAddress: "Ankara, Çankaya",
    orderDate: "2024-01-19",
    deliveryDate: null
  },
  {
    id: "#1245",
    customer: {
      name: "Mehmet Demir",
      email: "mehmet@email.com",
      phone: "+90 534 345 6789"
    },
    products: [
      { name: "Klavye Desteği", quantity: 1, price: 85 }
    ],
    total: 85,
    status: "Hazırlanıyor",
    paymentStatus: "Ödendi",
    shippingAddress: "İzmir, Konak",
    orderDate: "2024-01-18",
    deliveryDate: null
  },
  {
    id: "#1244",
    customer: {
      name: "Fatma Şahin",
      email: "fatma@email.com",
      phone: "+90 535 456 7890"
    },
    products: [
      { name: "LED Lamba", quantity: 1, price: 180 }
    ],
    total: 180,
    status: "Beklemede",
    paymentStatus: "Bekliyor",
    shippingAddress: "Bursa, Nilüfer",
    orderDate: "2024-01-17",
    deliveryDate: null
  },
  {
    id: "#1243",
    customer: {
      name: "Ali Özkan",
      email: "ali@email.com",
      phone: "+90 536 567 8901"
    },
    products: [
      { name: "Masaüstü Organizer", quantity: 1, price: 95 }
    ],
    total: 95,
    status: "Tamamlandı",
    paymentStatus: "Ödendi",
    shippingAddress: "Antalya, Muratpaşa",
    orderDate: "2024-01-16",
    deliveryDate: "2024-01-18"
  },
];

const statusOptions = ["Beklemede", "Hazırlanıyor", "Kargoda", "Tamamlandı", "İptal"];

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (orderId: string, newStatus: string) => {
    // TODO: Update order status logic
    console.log("Update order status:", orderId, newStatus);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Tamamlandı":
        return "bg-green-100 text-green-800";
      case "Kargoda":
        return "bg-blue-100 text-blue-800";
      case "Hazırlanıyor":
        return "bg-yellow-100 text-yellow-800";
      case "Beklemede":
        return "bg-gray-100 text-gray-800";
      case "İptal":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    return status === "Ödendi" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sipariş Yönetimi</h1>
          <p className="text-gray-600 mt-1">Siparişleri görüntüleyin ve yönetin</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            Rapor Al
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Toplam Sipariş</p>
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Bekleyen</p>
              <p className="text-2xl font-bold text-gray-900">
                {orders.filter(o => o.status === "Beklemede" || o.status === "Hazırlanıyor").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.586 13H7" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Kargoda</p>
              <p className="text-2xl font-bold text-gray-900">
                {orders.filter(o => o.status === "Kargoda").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tamamlanan</p>
              <p className="text-2xl font-bold text-gray-900">
                {orders.filter(o => o.status === "Tamamlandı").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Sipariş ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <svg className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">Tüm Durumlar</option>
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Toplam {filteredOrders.length} sipariş</span>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sipariş
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Müşteri
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ürünler
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tutar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ödeme
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="font-medium text-gray-900">{order.id}</p>
                      <p className="text-sm text-gray-500">{order.orderDate}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="font-medium text-gray-900">{order.customer.name}</p>
                      <p className="text-sm text-gray-500">{order.customer.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {order.products.map((product, index) => (
                        <p key={index} className="text-sm text-gray-900">
                          {product.quantity}x {product.name}
                        </p>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    ₺{order.total}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`text-xs font-semibold rounded-full px-2 py-1 border-0 focus:ring-2 focus:ring-orange-500 ${getStatusColor(order.status)}`}
                    >
                      {statusOptions.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-orange-600 hover:text-orange-900"
                    >
                      Detay
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setSelectedOrder(null)}></div>
            <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Sipariş Detayı - {selectedOrder.id}</h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Müşteri Bilgileri</h4>
                    <p className="text-sm text-gray-600">{selectedOrder.customer.name}</p>
                    <p className="text-sm text-gray-600">{selectedOrder.customer.email}</p>
                    <p className="text-sm text-gray-600">{selectedOrder.customer.phone}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Teslimat Adresi</h4>
                    <p className="text-sm text-gray-600">{selectedOrder.shippingAddress}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Sipariş Detayları</h4>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Ürün</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Adet</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Fiyat</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Toplam</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.products.map((product, index) => (
                          <tr key={index} className="border-t">
                            <td className="px-4 py-2 text-sm">{product.name}</td>
                            <td className="px-4 py-2 text-sm">{product.quantity}</td>
                            <td className="px-4 py-2 text-sm">₺{product.price}</td>
                            <td className="px-4 py-2 text-sm font-semibold">₺{product.quantity * product.price}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50">
                        <tr>
                          <td colSpan={3} className="px-4 py-2 text-sm font-semibold text-right">Toplam:</td>
                          <td className="px-4 py-2 text-sm font-bold">₺{selectedOrder.total}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Sipariş Tarihi</h4>
                    <p className="text-sm text-gray-600">{selectedOrder.orderDate}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Teslimat Tarihi</h4>
                    <p className="text-sm text-gray-600">{selectedOrder.deliveryDate || "Henüz teslim edilmedi"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
