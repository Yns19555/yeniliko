'use client';

import React, { useState, useEffect } from 'react';
import { activityTracker, OnlineUser, UserActivity, UserSession } from '@/lib/activity-tracker';

interface RealTimeUserActivityProps {
  userId?: string;
  showOnlineUsers?: boolean;
  showUserSessions?: boolean;
  refreshInterval?: number;
}

export default function RealTimeUserActivity({
  userId,
  showOnlineUsers = true,
  showUserSessions = true,
  refreshInterval = 30000 // 30 saniye
}: RealTimeUserActivityProps) {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [recentActivities, setRecentActivities] = useState<UserActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Verileri yükle
  const loadData = async () => {
    try {
      setIsLoading(true);

      // Online kullanıcıları getir
      if (showOnlineUsers) {
        const online = await activityTracker.getOnlineUsers();
        setOnlineUsers(online);
      }

      // Belirli kullanıcının session bilgilerini getir
      if (userId && showUserSessions) {
        const session = await activityTracker.getUserSession(userId);
        setUserSession(session);
      }

      // Son aktiviteleri getir
      if (userId) {
        const activities = await activityTracker.getUserActivities(userId, 20);
        setRecentActivities(activities);
      } else {
        const activities = await activityTracker.getAllActivities(50);
        setRecentActivities(activities);
      }
    } catch (error) {
      console.error('Failed to load real-time data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // İlk yükleme ve periyodik güncelleme
  useEffect(() => {
    loadData();

    const interval = setInterval(loadData, refreshInterval);
    return () => clearInterval(interval);
  }, [userId, showOnlineUsers, showUserSessions, refreshInterval]);

  // Aktivite türü için ikon
  const getActivityIcon = (type: UserActivity['activity_type']) => {
    const icons = {
      login: '🔑',
      logout: '🚪',
      page_view: '👁️',
      product_view: '🛍️',
      cart_add: '🛒',
      cart_remove: '🗑️',
      order_create: '📦',
      profile_update: '👤',
      search: '🔍',
      checkout_start: '💳',
      checkout_complete: '✅'
    };
    return icons[type] || '📝';
  };

  // Sayfa adını güzelleştir
  const formatPageName = (url: string) => {
    const pageNames: { [key: string]: string } = {
      '/': 'Ana Sayfa',
      '/products': 'Ürünler',
      '/cart': 'Sepet',
      '/checkout': 'Ödeme',
      '/profile': 'Profil',
      '/admin': 'Admin Panel',
      '/admin/users': 'Kullanıcı Yönetimi',
      '/admin/products': 'Ürün Yönetimi',
      '/admin/orders': 'Sipariş Yönetimi'
    };
    return pageNames[url] || url;
  };

  // Süreyi formatla
  const formatDuration = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}s ${minutes % 60}d`;
    } else if (minutes > 0) {
      return `${minutes}d ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  // Zaman farkını hesapla
  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Şimdi';
    if (diffMins < 60) return `${diffMins} dakika önce`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} saat önce`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} gün önce`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-600">Yükleniyor...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Online Kullanıcılar */}
      {showOnlineUsers && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-black">
              Online Kullanıcılar ({onlineUsers.length})
            </h3>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">Canlı</span>
            </div>
          </div>

          {onlineUsers.length > 0 ? (
            <div className="space-y-3">
              {onlineUsers.map((user) => (
                <div key={user.user_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                      {(user as any).users?.first_name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="font-bold text-black">
                        {(user as any).users?.first_name} {(user as any).users?.last_name}
                      </p>
                      <p className="text-sm font-medium text-gray-700">
                        {(user as any).users?.email}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-black">
                      {formatPageName(user.current_page)}
                    </p>
                    <p className="text-xs font-medium text-gray-700">
                      {getTimeAgo(user.last_seen)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="font-medium">Şu anda online kullanıcı yok</p>
            </div>
          )}
        </div>
      )}

      {/* Kullanıcı Session Bilgileri */}
      {showUserSessions && userSession && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-black mb-4">Session Bilgileri</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {formatDuration(userSession.total_time)}
              </div>
              <div className="text-sm font-medium text-blue-600">Toplam Süre</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {userSession.pages_visited.length}
              </div>
              <div className="text-sm font-medium text-green-600">Ziyaret Edilen Sayfa</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {userSession.cart_items.length}
              </div>
              <div className="text-sm font-medium text-purple-600">Sepetteki Ürün</div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-black mb-3">Ziyaret Edilen Sayfalar</h4>
            <div className="flex flex-wrap gap-2">
              {userSession.pages_visited.map((page, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-black font-medium rounded-full text-sm"
                >
                  {formatPageName(page)}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Son Aktiviteler */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-black mb-4">
          Son Aktiviteler ({recentActivities.length})
        </h3>

        {recentActivities.length > 0 ? (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-xl">{getActivityIcon(activity.activity_type)}</span>
                <div className="flex-1">
                  <p className="text-sm font-bold text-black">
                    {activity.details?.description || 
                     `${activity.activity_type} aktivitesi`}
                  </p>
                  {activity.page_url && (
                    <p className="text-xs font-medium text-gray-700">
                      📍 {formatPageName(activity.page_url)}
                    </p>
                  )}
                  <p className="text-xs font-medium text-gray-700">
                    🕒 {getTimeAgo(activity.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p className="font-medium">Henüz aktivite bulunmuyor</p>
          </div>
        )}
      </div>
    </div>
  );
}
