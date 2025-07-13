'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({
  children,
  requireAuth = true,
  requireAdmin = false,
  redirectTo,
  fallback
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Loading durumunda bekle
    if (isLoading) return;

    // Auth gerekli ama kullanıcı giriş yapmamış
    if (requireAuth && !isAuthenticated) {
      const loginUrl = redirectTo || '/login';
      router.push(loginUrl);
      return;
    }

    // Admin yetkisi gerekli ama kullanıcı admin değil
    if (requireAdmin && user?.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
  }, [isAuthenticated, isLoading, user, requireAuth, requireAdmin, redirectTo, router]);

  // Loading durumunda
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Auth gerekli ama kullanıcı giriş yapmamış
  if (requireAuth && !isAuthenticated) {
    return fallback || (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Giriş Gerekli</h2>
          <p className="text-gray-600 mb-6">Bu sayfayı görüntülemek için giriş yapmalısınız.</p>
          <button
            onClick={() => router.push('/login')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Giriş Yap
          </button>
        </div>
      </div>
    );
  }

  // Admin yetkisi gerekli ama kullanıcı admin değil
  if (requireAdmin && user?.role !== 'admin') {
    return fallback || (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⛔</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Yetkisiz Erişim</h2>
          <p className="text-gray-600 mb-6">Bu sayfaya erişim yetkiniz bulunmamaktadır.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Dashboard'a Dön
          </button>
        </div>
      </div>
    );
  }

  // Her şey yolunda, içeriği göster
  return <>{children}</>;
}

// Hook for checking permissions
export function usePermissions() {
  const { user, isAuthenticated } = useAuth();

  const hasPermission = (permission: 'admin' | 'user' | 'manager') => {
    if (!isAuthenticated || !user) return false;

    switch (permission) {
      case 'admin':
        return user.role === 'admin';
      case 'manager':
        return user.role === 'admin' || user.role === 'manager';
      case 'user':
        return isAuthenticated;
      default:
        return false;
    }
  };

  const canAccess = (requiredRole: 'admin' | 'user' | 'manager') => {
    return hasPermission(requiredRole);
  };

  return {
    hasPermission,
    canAccess,
    isAdmin: user?.role === 'admin',
    isManager: user?.role === 'manager',
    isUser: isAuthenticated
  };
}
