'use client';

import React, { useState, useEffect } from 'react';
import { activityTracker, UserActivity, OnlineUser } from '@/lib/activity-tracker';

interface UserActivityTrackerProps {
  userId?: string; // Belirli bir kullanıcı için, yoksa tüm aktiviteler
  showOnlineUsers?: boolean;
  maxActivities?: number;
}

export default function UserActivityTracker({ 
  userId, 
  showOnlineUsers = true, 
  maxActivities = 50 
}: UserActivityTrackerProps) {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'activities' | 'online'>('activities');

  // Aktiviteleri yükle
  const loadActivities = async () => {
    try {
      setIsLoading(true);
      let data: UserActivity[];
      
      if (userId) {
        data = await activityTracker.getUserActivities(userId, maxActivities);
      } else {
        data = await activityTracker.getAllActivities(maxActivities);
      }
      
      setActivities(data);
    } catch (error) {
      console.error('Failed to load activities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Online kullanıcıları yükle
  const loadOnlineUsers = async () => {
    try {
      const data = await activityTracker.getOnlineUsers();
      setOnlineUsers(data);
    } catch (error) {
      console.error('Failed to load online users:', error);
    }
  };

  // İlk yükleme
  useEffect(() => {
    loadActivities();
    if (showOnlineUsers) {
      loadOnlineUsers();
    }
  }, [userId, maxActivities, showOnlineUsers]);

  // Periyodik güncelleme (30 saniyede bir)
  useEffect(() => {
    const interval = setInterval(() => {
      loadActivities();
      if (showOnlineUsers) {
        loadOnlineUsers();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [userId, maxActivities, showOnlineUsers]);

  // Aktivite türü için ikon
  const getActivityIcon = (type: UserActivity['activity_type']) => {
    const icons = {
      login: '🔑',
      logout: '🚪',
      page_view: '👁️',
      product_view: '🛍️',
      cart_add: '🛒',
      order_create: '📦',
      profile_update: '👤'
    };
    return icons[type] || '📝';
  };

  // Aktivite türü için açıklama
  const getActivityDescription = (activity: UserActivity) => {
    const descriptions = {
      login: 'Giriş yaptı',
      logout: 'Çıkış yaptı',
      page_view: `Sayfa görüntüledi: ${activity.page_url}`,
      product_view: `Ürün görüntüledi: ${activity.product_id}`,
      cart_add: `Sepete ürün ekledi: ${activity.product_id}`,
      order_create: 'Sipariş oluşturdu',
      profile_update: 'Profil güncelledi'
    };
    return descriptions[activity.activity_type] || 'Bilinmeyen aktivite';
  };

  // Zaman formatı
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Az önce';
    if (minutes < 60) return `${minutes} dakika önce`;
    if (hours < 24) return `${hours} saat önce`;
    if (days < 7) return `${days} gün önce`;
    
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Sayfa adını temizle
  const getPageName = (url: string) => {
    const pageNames: { [key: string]: string } = {
      '/': 'Ana Sayfa',
      '/products': 'Ürünler',
      '/cart': 'Sepet',
      '/checkout': 'Ödeme',
      '/dashboard': 'Hesabım',
      '/admin': 'Admin Panel',
      '/admin/users': 'Kullanıcı Yönetimi',
      '/admin/products': 'Ürün Yönetimi',
      '/admin/orders': 'Sipariş Yönetimi',
      '/login': 'Giriş',
      '/register': 'Kayıt'
    };

    return pageNames[url] || url;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {userId ? 'Kullanıcı Aktiviteleri' : 'Tüm Aktiviteler'}
          </h3>
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('activities')}
              className={`px-3 py-1 text-sm font-medium rounded-lg ${
                activeTab === 'activities'
                  ? 'bg-orange-100 text-orange-800'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📝 Aktiviteler ({activities.length})
            </button>
            {showOnlineUsers && (
              <button
                onClick={() => setActiveTab('online')}
                className={`px-3 py-1 text-sm font-medium rounded-lg ${
                  activeTab === 'online'
                    ? 'bg-green-100 text-green-800'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🟢 Online ({onlineUsers.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'activities' ? (
          <div className="space-y-4">
            {activities.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <span className="text-4xl mb-2 block">📝</span>
                Henüz aktivite bulunmuyor
              </div>
            ) : (
              activities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-2xl">{getActivityIcon(activity.activity_type)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {getActivityDescription(activity)}
                      </p>
                      <span className="text-xs text-gray-500">
                        {formatTime(activity.created_at)}
                      </span>
                    </div>
                    {activity.page_url && activity.activity_type === 'page_view' && (
                      <p className="text-xs text-gray-600 mt-1">
                        📍 {getPageName(activity.page_url)}
                      </p>
                    )}
                    {activity.ip_address && (
                      <p className="text-xs text-gray-500 mt-1">
                        🌐 {activity.ip_address}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {onlineUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <span className="text-4xl mb-2 block">😴</span>
                Şu anda online kullanıcı yok
              </div>
            ) : (
              onlineUsers.map((user) => (
                <div key={user.user_id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Kullanıcı: {user.user_id.slice(0, 8)}...
                      </p>
                      <p className="text-xs text-gray-600">
                        📍 {getPageName(user.current_page)}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatTime(user.last_seen)}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Son güncelleme: {new Date().toLocaleTimeString('tr-TR')}</span>
          <button
            onClick={() => {
              loadActivities();
              if (showOnlineUsers) loadOnlineUsers();
            }}
            className="text-orange-600 hover:text-orange-800 font-medium"
          >
            🔄 Yenile
          </button>
        </div>
      </div>
    </div>
  );
}
