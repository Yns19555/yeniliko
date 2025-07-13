"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AdminUser, verifyToken, logActivity as logActivityLib } from '@/lib/auth';

interface AdminContextType {
  user: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  logActivity: (action: string, resource: string, details?: any) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      const userData = verifyToken(token);
      if (userData) {
        setUser(userData);
        // Log session verification
        logActivityLib(userData, 'session_verified', 'auth');
      } else {
        localStorage.removeItem('admin_token');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('admin_token');
    } finally {
      setIsLoading(false);
    }
  };

  const login = (token: string) => {
    try {
      localStorage.setItem('admin_token', token);
      const userData = verifyToken(token);
      if (userData) {
        setUser(userData);
        logActivityLib(userData, 'login', 'auth');
      }
    } catch (error) {
      console.error('Login failed:', error);
      localStorage.removeItem('admin_token');
      throw error;
    }
  };

  const logout = () => {
    if (user) {
      logActivityLib(user, 'logout', 'auth');
    }
    localStorage.removeItem('admin_token');
    setUser(null);
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (user.permissions.includes('*')) return true;
    return user.permissions.includes(permission);
  };

  const logUserActivity = (action: string, resource: string, details?: any) => {
    if (user) {
      logActivityLib(user, action, resource, details);
    }
  };

  const value: AdminContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    hasPermission,
    logActivity: logUserActivity,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}

// Higher-order component for protecting admin routes
export function withAdminAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredPermission?: string
) {
  return function ProtectedComponent(props: P) {
    const { user, isLoading, hasPermission } = useAdmin();

    if (isLoading) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Yetkilendirme kontrol ediliyor...</p>
          </div>
        </div>
      );
    }

    if (!user) {
      // Redirect to admin login
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/login';
      }
      return null;
    }

    if (requiredPermission && !hasPermission(requiredPermission)) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Erişim Reddedildi</h2>
            <p className="text-gray-600 mb-4">Bu sayfaya erişim için gerekli yetkiniz bulunmuyor.</p>
            <p className="text-sm text-gray-500">Gerekli yetki: {requiredPermission}</p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
