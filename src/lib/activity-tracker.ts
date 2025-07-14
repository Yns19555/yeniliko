// Activity Tracker - Kullanıcı aktivitelerini takip eder
import { supabase } from './supabase';

export interface UserActivity {
  id: string;
  user_id: string;
  activity_type: 'login' | 'logout' | 'page_view' | 'product_view' | 'cart_add' | 'order_create' | 'profile_update';
  page_url?: string;
  product_id?: string;
  details?: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface OnlineUser {
  user_id: string;
  last_seen: string;
  current_page: string;
  is_online: boolean;
}

class ActivityTracker {
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private currentUserId: string | null = null;
  private currentPage: string = '';

  // Aktivite kaydet
  async trackActivity(
    userId: string,
    activityType: UserActivity['activity_type'],
    details?: {
      pageUrl?: string;
      productId?: string;
      additionalData?: any;
    }
  ) {
    try {
      const activity: Omit<UserActivity, 'id' | 'created_at'> = {
        user_id: userId,
        activity_type: activityType,
        page_url: details?.pageUrl || window.location.pathname,
        product_id: details?.productId,
        details: details?.additionalData,
        ip_address: await this.getClientIP(),
        user_agent: navigator.userAgent
      };

      const { error } = await supabase
        .from('user_activities')
        .insert([activity]);

      if (error) {
        console.error('Activity tracking error:', error);
      }
    } catch (error) {
      console.error('Activity tracking failed:', error);
    }
  }

  // Kullanıcı online durumunu güncelle
  async updateOnlineStatus(userId: string, isOnline: boolean = true) {
    try {
      const onlineData: Omit<OnlineUser, 'user_id'> = {
        last_seen: new Date().toISOString(),
        current_page: window.location.pathname,
        is_online: isOnline
      };

      const { error } = await supabase
        .from('user_online_status')
        .upsert([{
          user_id: userId,
          ...onlineData
        }]);

      if (error) {
        console.error('Online status update error:', error);
      }
    } catch (error) {
      console.error('Online status update failed:', error);
    }
  }

  // Heartbeat başlat (her 30 saniyede bir online durumu güncelle)
  startHeartbeat(userId: string) {
    this.currentUserId = userId;
    this.currentPage = window.location.pathname;

    // İlk güncelleme
    this.updateOnlineStatus(userId, true);

    // Periyodik güncelleme
    this.heartbeatInterval = setInterval(() => {
      if (this.currentUserId) {
        this.updateOnlineStatus(this.currentUserId, true);
      }
    }, 30000); // 30 saniye

    // Sayfa değişikliklerini takip et
    this.trackPageChanges(userId);

    // Sayfa kapatılırken offline yap
    window.addEventListener('beforeunload', () => {
      if (this.currentUserId) {
        this.updateOnlineStatus(this.currentUserId, false);
      }
    });

    // Visibility API ile tab değişikliklerini takip et
    document.addEventListener('visibilitychange', () => {
      if (this.currentUserId) {
        const isVisible = !document.hidden;
        this.updateOnlineStatus(this.currentUserId, isVisible);
      }
    });
  }

  // Heartbeat durdur
  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    if (this.currentUserId) {
      this.updateOnlineStatus(this.currentUserId, false);
      this.currentUserId = null;
    }
  }

  // Sayfa değişikliklerini takip et
  private trackPageChanges(userId: string) {
    const currentPath = window.location.pathname;
    
    if (this.currentPage !== currentPath) {
      this.trackActivity(userId, 'page_view', {
        pageUrl: currentPath
      });
      this.currentPage = currentPath;
    }

    // History API değişikliklerini dinle
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      setTimeout(() => {
        const newPath = window.location.pathname;
        if (activityTracker.currentPage !== newPath) {
          activityTracker.trackActivity(userId, 'page_view', {
            pageUrl: newPath
          });
          activityTracker.currentPage = newPath;
        }
      }, 0);
    };

    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      setTimeout(() => {
        const newPath = window.location.pathname;
        if (activityTracker.currentPage !== newPath) {
          activityTracker.trackActivity(userId, 'page_view', {
            pageUrl: newPath
          });
          activityTracker.currentPage = newPath;
        }
      }, 0);
    };

    // Popstate eventi (geri/ileri butonları)
    window.addEventListener('popstate', () => {
      setTimeout(() => {
        const newPath = window.location.pathname;
        if (this.currentPage !== newPath) {
          this.trackActivity(userId, 'page_view', {
            pageUrl: newPath
          });
          this.currentPage = newPath;
        }
      }, 0);
    });
  }

  // Client IP adresini al
  private async getClientIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return 'unknown';
    }
  }

  // Online kullanıcıları getir
  async getOnlineUsers(): Promise<OnlineUser[]> {
    try {
      const { data, error } = await supabase
        .from('user_online_status')
        .select('*')
        .eq('is_online', true)
        .gte('last_seen', new Date(Date.now() - 5 * 60 * 1000).toISOString()); // Son 5 dakika

      if (error) {
        console.error('Get online users error:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Get online users failed:', error);
      return [];
    }
  }

  // Kullanıcı aktivitelerini getir
  async getUserActivities(userId: string, limit: number = 50): Promise<UserActivity[]> {
    try {
      const { data, error } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Get user activities error:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Get user activities failed:', error);
      return [];
    }
  }

  // Tüm aktiviteleri getir (admin için)
  async getAllActivities(limit: number = 100): Promise<UserActivity[]> {
    try {
      const { data, error } = await supabase
        .from('user_activities')
        .select(`
          *,
          users:user_id (
            first_name,
            last_name,
            email
          )
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Get all activities error:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Get all activities failed:', error);
      return [];
    }
  }
}

// Singleton instance
export const activityTracker = new ActivityTracker();

// Kolay kullanım için helper fonksiyonlar
export const trackLogin = (userId: string) => 
  activityTracker.trackActivity(userId, 'login');

export const trackLogout = (userId: string) => 
  activityTracker.trackActivity(userId, 'logout');

export const trackProductView = (userId: string, productId: string) => 
  activityTracker.trackActivity(userId, 'product_view', { productId });

export const trackCartAdd = (userId: string, productId: string, additionalData?: any) => 
  activityTracker.trackActivity(userId, 'cart_add', { productId, additionalData });

export const trackOrderCreate = (userId: string, additionalData?: any) => 
  activityTracker.trackActivity(userId, 'order_create', { additionalData });

export const trackProfileUpdate = (userId: string, additionalData?: any) => 
  activityTracker.trackActivity(userId, 'profile_update', { additionalData });
