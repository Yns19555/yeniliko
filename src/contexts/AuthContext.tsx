'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

// Kullanıcı tipi
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'user' | 'admin' | 'manager';
  avatar?: string;
  emailVerified: boolean;
  createdAt: string;
  lastLogin?: string;
}

// Auth context tipi
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; message: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<{ success: boolean; message: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  verifyEmail: (token: string) => Promise<{ success: boolean; message: string }>;
  refreshToken: () => Promise<boolean>;
}

// Kayıt verisi tipi
export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  acceptTerms: boolean;
  acceptMarketing?: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo kullanıcılar (gerçek uygulamada API'den gelecek)
const demoUsers: User[] = [
  {
    id: '1',
    email: 'admin@yeniliko.com',
    firstName: 'Admin',
    lastName: 'User',
    phone: '+90 555 123 45 67',
    role: 'admin',
    emailVerified: true,
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: new Date().toISOString()
  },
  {
    id: '2',
    email: 'user@example.com',
    firstName: 'Test',
    lastName: 'User',
    phone: '+90 555 987 65 43',
    role: 'user',
    emailVerified: true,
    createdAt: '2024-01-15T00:00:00Z'
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Client-side mount kontrolü
  useEffect(() => {
    setIsClient(true);
    checkAuthStatus();
  }, []);

  // Auth durumunu kontrol et
  const checkAuthStatus = async () => {
    try {
      // Browser ortamında mı kontrol et
      if (typeof window === 'undefined') {
        setIsLoading(false);
        return;
      }

      const token = localStorage.getItem('yeniliko-token');
      const userData = localStorage.getItem('yeniliko-user');

      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        // Token geçerliliğini kontrol et (gerçek uygulamada API çağrısı)
        if (isTokenValid(token)) {
          setUser(parsedUser);
        } else {
          // Token geçersizse temizle
          localStorage.removeItem('yeniliko-token');
          localStorage.removeItem('yeniliko-user');
        }
      }
    } catch (error) {
      console.error('Auth status check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Token geçerliliğini kontrol et (basit implementasyon)
  const isTokenValid = (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  };

  // JWT token oluştur (demo amaçlı)
  const generateToken = (userId: string): string => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      userId,
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 saat
      iat: Math.floor(Date.now() / 1000)
    }));
    const signature = btoa('demo-signature'); // Gerçek uygulamada güvenli imza
    return `${header}.${payload}.${signature}`;
  };

  // Giriş yap
  const login = useCallback(async (email: string, password: string, rememberMe = false): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);

    try {
      // API çağrısı yap
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.error || 'Giriş başarısız!' };
      }

      // API'den gelen kullanıcı bilgilerini kullan
      const { user: apiUser, token } = data;

      const foundUser = {
        id: apiUser.id,
        email: apiUser.email,
        firstName: apiUser.firstName,
        lastName: apiUser.lastName,
        role: apiUser.role,
        emailVerified: true,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      // Kullanıcı bilgilerini kaydet
      setUser(foundUser);

      if (typeof window !== 'undefined') {
        localStorage.setItem('yeniliko-token', token);
        localStorage.setItem('yeniliko-user', JSON.stringify(foundUser));

        if (rememberMe) {
          localStorage.setItem('yeniliko-remember', 'true');
        }
      }

      return { success: true, message: 'Giriş başarılı!' };
    } catch (error) {
      return { success: false, message: 'Giriş sırasında bir hata oluştu!' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Kayıt ol
  const register = async (userData: RegisterData): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);

    try {
      // API çağrısı yap
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          password: userData.password,
          phone: userData.phone,
          acceptMarketing: userData.acceptMarketing
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.error || 'Kayıt başarısız!' };
      }

      // API'den gelen kullanıcı bilgilerini kullan
      const { user: apiUser, token } = data;

      const newUser = {
        id: apiUser.id,
        email: apiUser.email,
        firstName: apiUser.firstName,
        lastName: apiUser.lastName,
        role: apiUser.role,
        emailVerified: true,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      // Kullanıcı bilgilerini kaydet
      setUser(newUser);

      if (typeof window !== 'undefined') {
        localStorage.setItem('yeniliko-token', token);
        localStorage.setItem('yeniliko-user', JSON.stringify(newUser));
      }

      return { success: true, message: 'Kayıt başarılı! Hoş geldiniz!' };
    } catch (error) {
      return { success: false, message: 'Kayıt sırasında bir hata oluştu!' };
    } finally {
      setIsLoading(false);
    }
  };

  // Çıkış yap
  const logout = () => {
    setUser(null);

    if (typeof window !== 'undefined') {
      localStorage.removeItem('yeniliko-token');
      localStorage.removeItem('yeniliko-user');
      localStorage.removeItem('yeniliko-remember');
    }
  };

  // Profil güncelle
  const updateProfile = async (userData: Partial<User>): Promise<{ success: boolean; message: string }> => {
    if (!user) return { success: false, message: 'Kullanıcı oturumu bulunamadı!' };

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);

      if (typeof window !== 'undefined') {
        localStorage.setItem('yeniliko-user', JSON.stringify(updatedUser));
      }

      return { success: true, message: 'Profil başarıyla güncellendi!' };
    } catch (error) {
      return { success: false, message: 'Profil güncellenirken hata oluştu!' };
    }
  };

  // Şifre değiştir
  const changePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo için basit kontrol
      if (currentPassword === 'wrongpassword') {
        return { success: false, message: 'Mevcut şifre hatalı!' };
      }

      return { success: true, message: 'Şifre başarıyla değiştirildi!' };
    } catch (error) {
      return { success: false, message: 'Şifre değiştirirken hata oluştu!' };
    }
  };

  // Şifre sıfırlama isteği
  const forgotPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const userExists = demoUsers.some(u => u.email === email);
      if (!userExists) {
        return { success: false, message: 'Bu e-posta adresi kayıtlı değil!' };
      }

      return { success: true, message: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi!' };
    } catch (error) {
      return { success: false, message: 'İstek gönderilirken hata oluştu!' };
    }
  };

  // Şifre sıfırla
  const resetPassword = async (token: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true, message: 'Şifre başarıyla sıfırlandı!' };
    } catch (error) {
      return { success: false, message: 'Şifre sıfırlanırken hata oluştu!' };
    }
  };

  // E-posta doğrula
  const verifyEmail = async (token: string): Promise<{ success: boolean; message: string }> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (user) {
        const updatedUser = { ...user, emailVerified: true };
        setUser(updatedUser);

        if (typeof window !== 'undefined') {
          localStorage.setItem('yeniliko-user', JSON.stringify(updatedUser));
        }
      }

      return { success: true, message: 'E-posta adresi başarıyla doğrulandı!' };
    } catch (error) {
      return { success: false, message: 'E-posta doğrulanırken hata oluştu!' };
    }
  };

  // Token yenile
  const refreshToken = async (): Promise<boolean> => {
    try {
      if (!user) return false;
      
      const newToken = generateToken(user.id);

      if (typeof window !== 'undefined') {
        localStorage.setItem('yeniliko-token', newToken);
      }
      return true;
    } catch (error) {
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    verifyEmail,
    refreshToken
  };

  // SSR sırasında loading state göster
  if (!isClient) {
    return (
      <AuthContext.Provider value={{
        user: null,
        isLoading: true,
        isAuthenticated: false,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        forgotPassword,
        resetPassword,
        verifyEmail,
        refreshToken
      }}>
        {children}
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
