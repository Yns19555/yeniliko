"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { useAuth, RegisterData } from '@/contexts/AuthContext';

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  acceptTerms?: string;
}

export default function Register() {
  const router = useRouter();
  const { register } = useAuth();

  const [formData, setFormData] = useState<RegisterData & { confirmPassword: string }>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    acceptTerms: false,
    acceptMarketing: false
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Şifre güçlülük kontrolü
  const checkPasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // E-posta kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'E-posta adresi gerekli';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi girin';
    }

    // Şifre kontrolü
    if (!formData.password) {
      newErrors.password = 'Şifre gerekli';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Şifre en az 6 karakter olmalı';
    }

    // Şifre tekrar kontrolü
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Şifre tekrarı gerekli';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Şifreler eşleşmiyor';
    }

    // Ad kontrolü
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Ad gerekli';
    }

    // Soyad kontrolü
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Soyad gerekli';
    }

    // Telefon kontrolü (opsiyonel ama format kontrolü)
    if (formData.phone && formData.phone.trim() && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Geçerli bir telefon numarası girin';
    }

    // Şartlar kontrolü
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Kullanım şartlarını kabul etmelisiniz';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const { confirmPassword, ...registerData } = formData;
    const result = await register(registerData);

    if (result.success) {
      alert(result.message);
      router.push('/login?message=registration-success');
    } else {
      alert(result.message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Şifre güçlülük kontrolü
    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }

    // Hata temizle
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Şifre güçlülük rengi
  const getPasswordStrengthColor = (strength: number): string => {
    if (strength <= 1) return 'bg-red-500';
    if (strength <= 2) return 'bg-orange-500';
    if (strength <= 3) return 'bg-yellow-500';
    if (strength <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = (strength: number): string => {
    if (strength <= 1) return 'Çok Zayıf';
    if (strength <= 2) return 'Zayıf';
    if (strength <= 3) return 'Orta';
    if (strength <= 4) return 'Güçlü';
    return 'Çok Güçlü';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ff6600\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"}}></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Back to Home */}
        <Link href="/" className="inline-flex items-center text-white hover:text-orange-500 transition-colors mb-8 group">
          <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Ana Sayfaya Dön
        </Link>

        {/* Register Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Image
                src="/yeniliko-logo.png"
                alt="Yeniliko Logo"
                width={48}
                height={48}
                className="object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold text-white">Yeniliko</h1>
                <p className="text-xs text-orange-500">3D Tasarım & Üretim</p>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Hesap Oluşturun</h2>
            <p className="text-gray-300">3D dünyasına katılın</p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-white mb-2">
                  Ad
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                    errors.firstName ? 'border-red-500' : 'border-white/20'
                  }`}
                  placeholder="Adınız"
                  required
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-400">{errors.firstName}</p>
                )}
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-white mb-2">
                  Soyad
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                    errors.lastName ? 'border-red-500' : 'border-white/20'
                  }`}
                  placeholder="Soyadınız"
                  required
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-400">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-white mb-2">
                Telefon Numarası <span className="text-gray-400">(Opsiyonel)</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                    errors.phone ? 'border-red-500' : 'border-white/20'
                  }`}
                  placeholder="+90 555 123 45 67"
                />
                <svg className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-400">{errors.phone}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                E-posta Adresi
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="ornek@email.com"
                  required
                />
                <svg className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Şifre
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all pr-12"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength)}`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-400">{getPasswordStrengthText(passwordStrength)}</span>
                  </div>
                </div>
              )}
              <p className="text-xs text-gray-400 mt-1">En az 6 karakter olmalıdır</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
                Şifre Tekrarı
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="w-4 h-4 text-orange-500 bg-white/10 border-white/20 rounded focus:ring-orange-500 focus:ring-2 mt-0.5"
                  required
                />
                <span className="ml-2 text-sm text-gray-300">
                  <Link href="/terms" className="text-orange-500 hover:text-orange-400 transition-colors">
                    Kullanım Koşulları
                  </Link>{" "}
                  ve{" "}
                  <Link href="/privacy" className="text-orange-500 hover:text-orange-400 transition-colors">
                    Gizlilik Politikası
                  </Link>
                  'nı kabul ediyorum
                </span>
              </label>
              
              <label className="flex items-start">
                <input
                  type="checkbox"
                  name="acceptMarketing"
                  checked={formData.acceptMarketing}
                  onChange={handleChange}
                  className="w-4 h-4 text-orange-500 bg-white/10 border-white/20 rounded focus:ring-orange-500 focus:ring-2 mt-0.5"
                />
                <span className="ml-2 text-sm text-gray-300">
                  Yeni ürünler ve kampanyalar hakkında e-posta almak istiyorum
                </span>
              </label>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-3 px-4 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              Hesap Oluştur
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-white/20"></div>
            <span className="px-4 text-gray-400 text-sm">veya</span>
            <div className="flex-1 border-t border-white/20"></div>
          </div>

          {/* Social Register */}
          <div className="space-y-3">
            <button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center space-x-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Google ile Kayıt Ol</span>
            </button>
          </div>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-300">
              Zaten hesabınız var mı?{" "}
              <Link href="/login" className="text-orange-500 hover:text-orange-400 font-semibold transition-colors">
                Giriş Yapın
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
