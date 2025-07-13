import { z } from 'zod';

// Auth validation schemas
export const loginSchema = z.object({
  email: z.string().email('Geçerli bir email adresi giriniz'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
});

export const registerSchema = z.object({
  email: z.string().email('Geçerli bir email adresi giriniz'),
  password: z.string()
    .min(6, 'Şifre en az 6 karakter olmalıdır')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir'),
  firstName: z.string()
    .min(2, 'Ad en az 2 karakter olmalıdır')
    .max(50, 'Ad en fazla 50 karakter olabilir')
    .regex(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, 'Ad sadece harf içerebilir'),
  lastName: z.string()
    .min(2, 'Soyad en az 2 karakter olmalıdır')
    .max(50, 'Soyad en fazla 50 karakter olabilir')
    .regex(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, 'Soyad sadece harf içerebilir'),
  phone: z.string()
    .regex(/^[\+]?[0-9\s\-\(\)]{10,}$/, 'Geçerli bir telefon numarası giriniz')
    .optional(),
  acceptTerms: z.boolean().refine(val => val === true, 'Kullanım şartlarını kabul etmelisiniz'),
  acceptMarketing: z.boolean().optional(),
});

// Product validation schemas
export const productSchema = z.object({
  name: z.string()
    .min(3, 'Ürün adı en az 3 karakter olmalıdır')
    .max(100, 'Ürün adı en fazla 100 karakter olabilir'),
  description: z.string()
    .min(10, 'Açıklama en az 10 karakter olmalıdır')
    .max(1000, 'Açıklama en fazla 1000 karakter olabilir')
    .optional(),
  price: z.number()
    .positive('Fiyat pozitif bir sayı olmalıdır')
    .max(999999, 'Fiyat çok yüksek'),
  stock: z.number()
    .int('Stok sayısı tam sayı olmalıdır')
    .min(0, 'Stok sayısı negatif olamaz')
    .max(9999, 'Stok sayısı çok yüksek'),
  category: z.enum(['Aksesuarlar', 'Dekorasyon', 'Ofis', 'Oyuncaklar'], {
    errorMap: () => ({ message: 'Geçerli bir kategori seçiniz' })
  }),
  images: z.array(z.string().url('Geçerli bir resim URL\'si giriniz'))
    .min(1, 'En az bir resim eklemelisiniz')
    .max(5, 'En fazla 5 resim ekleyebilirsiniz'),
});

// Order validation schemas
export const orderSchema = z.object({
  items: z.array(z.object({
    productId: z.string().min(1, 'Ürün ID gerekli'),
    quantity: z.number().int().positive('Miktar pozitif bir tam sayı olmalıdır'),
    price: z.number().positive('Fiyat pozitif olmalıdır'),
  })).min(1, 'En az bir ürün seçmelisiniz'),
  shippingAddress: z.string().min(10, 'Teslimat adresi en az 10 karakter olmalıdır'),
  shippingCity: z.string().min(2, 'Şehir adı en az 2 karakter olmalıdır'),
  shippingZip: z.string().regex(/^\d{5}$/, 'Posta kodu 5 haneli olmalıdır'),
  shippingPhone: z.string().regex(/^[\+]?[0-9\s\-\(\)]{10,}$/, 'Geçerli bir telefon numarası giriniz'),
});

// Contact form validation
export const contactSchema = z.object({
  name: z.string()
    .min(2, 'Ad en az 2 karakter olmalıdır')
    .max(100, 'Ad en fazla 100 karakter olabilir'),
  email: z.string().email('Geçerli bir email adresi giriniz'),
  subject: z.string()
    .min(5, 'Konu en az 5 karakter olmalıdır')
    .max(200, 'Konu en fazla 200 karakter olabilir'),
  message: z.string()
    .min(10, 'Mesaj en az 10 karakter olmalıdır')
    .max(1000, 'Mesaj en fazla 1000 karakter olabilir'),
});

// Utility function to validate and sanitize input
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: string[];
} {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => err.message);
      return { success: false, errors };
    }
    return { success: false, errors: ['Validation failed'] };
  }
}

// Sanitization functions
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
}

export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

export function sanitizePhone(phone: string): string {
  return phone.replace(/[^\d\+\-\(\)\s]/g, '');
}
