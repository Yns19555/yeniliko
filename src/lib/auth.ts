// Simple JWT alternative for demo purposes
const JWT_SECRET = 'yeniliko-admin-secret-key-2024';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'moderator';
  permissions: string[];
  lastLogin: Date;
  ipAddress?: string;
  twoFactorEnabled: boolean;
}

export interface LoginAttempt {
  ip: string;
  email: string;
  timestamp: Date;
  success: boolean;
  userAgent?: string;
}

// Mock admin users database
const ADMIN_USERS: Record<string, AdminUser & { password: string; twoFactorSecret?: string }> = {
  'admin@yeniliko.com': {
    id: '1',
    email: 'admin@yeniliko.com',
    name: 'Super Admin',
    password: 'admin123', // In production, this should be hashed
    role: 'super_admin',
    permissions: ['*'], // All permissions
    lastLogin: new Date(),
    twoFactorEnabled: false,
    twoFactorSecret: undefined
  },
  'manager@yeniliko.com': {
    id: '2',
    email: 'manager@yeniliko.com',
    name: 'Store Manager',
    password: 'manager123',
    role: 'admin',
    permissions: ['products.read', 'products.write', 'orders.read', 'orders.write', 'users.read'],
    lastLogin: new Date(),
    twoFactorEnabled: true,
    twoFactorSecret: 'JBSWY3DPEHPK3PXP' // Base32 secret for TOTP
  }
};

// IP Whitelist - In production, this should be in database
const IP_WHITELIST = [
  '127.0.0.1',
  '::1',
  'localhost',
  // Add your allowed IP addresses here
];

// Rate limiting storage (in production, use Redis)
const loginAttempts: Map<string, LoginAttempt[]> = new Map();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

export class SecurityError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'SecurityError';
  }
}

// Simple token creation (Base64 encoded JSON for demo)
export function createToken(user: AdminUser): string {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    permissions: user.permissions,
    iat: Date.now(),
    exp: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
    secret: JWT_SECRET
  };

  return btoa(JSON.stringify(payload));
}

export function verifyToken(token: string): AdminUser | null {
  try {
    const payload = JSON.parse(atob(token));

    // Check expiration
    if (Date.now() > payload.exp) {
      return null;
    }

    // Check secret
    if (payload.secret !== JWT_SECRET) {
      return null;
    }

    // Check if user still exists and is active
    const user = Object.values(ADMIN_USERS).find(u => u.id === payload.id);
    if (!user) {
      return null;
    }

    return {
      id: payload.id,
      email: payload.email,
      name: user.name,
      role: payload.role,
      permissions: payload.permissions,
      lastLogin: user.lastLogin,
      twoFactorEnabled: user.twoFactorEnabled
    };
  } catch (error) {
    return null;
  }
}

export function checkIPWhitelist(ip: string): boolean {
  // In development, allow all IPs
  if (process.env.NODE_ENV === 'development') {
    return true;
  }
  
  return IP_WHITELIST.includes(ip) || IP_WHITELIST.includes('*');
}

export function checkRateLimit(ip: string, email: string): boolean {
  const key = `${ip}:${email}`;
  const attempts = loginAttempts.get(key) || [];
  
  // Clean old attempts
  const cutoff = new Date(Date.now() - LOCKOUT_DURATION);
  const recentAttempts = attempts.filter(attempt => attempt.timestamp > cutoff);
  
  loginAttempts.set(key, recentAttempts);
  
  return recentAttempts.length < MAX_LOGIN_ATTEMPTS;
}

export function recordLoginAttempt(ip: string, email: string, success: boolean, userAgent?: string): void {
  const key = `${ip}:${email}`;
  const attempts = loginAttempts.get(key) || [];
  
  attempts.push({
    ip,
    email,
    timestamp: new Date(),
    success,
    userAgent
  });
  
  loginAttempts.set(key, attempts);
  
  // Log security event
  console.log(`[SECURITY] Login attempt: ${email} from ${ip} - ${success ? 'SUCCESS' : 'FAILED'}`);
}

export function authenticateAdmin(
  email: string,
  password: string,
  ip: string,
  userAgent?: string,
  twoFactorCode?: string
): { user: AdminUser; token: string } | null {
  
  // Check IP whitelist
  if (!checkIPWhitelist(ip)) {
    recordLoginAttempt(ip, email, false, userAgent);
    throw new SecurityError('Access denied from this IP address', 'IP_BLOCKED');
  }
  
  // Check rate limiting
  if (!checkRateLimit(ip, email)) {
    recordLoginAttempt(ip, email, false, userAgent);
    throw new SecurityError('Too many login attempts. Please try again later.', 'RATE_LIMITED');
  }
  
  // Find user
  const userData = ADMIN_USERS[email];
  if (!userData || userData.password !== password) {
    recordLoginAttempt(ip, email, false, userAgent);
    throw new SecurityError('Invalid credentials', 'INVALID_CREDENTIALS');
  }
  
  // Check 2FA if enabled
  if (userData.twoFactorEnabled) {
    if (!twoFactorCode) {
      throw new SecurityError('Two-factor authentication code required', 'TWO_FACTOR_REQUIRED');
    }
    
    // Verify TOTP code (simplified - in production use proper TOTP library)
    const isValidTOTP = verifyTOTP(userData.twoFactorSecret!, twoFactorCode);
    if (!isValidTOTP) {
      recordLoginAttempt(ip, email, false, userAgent);
      throw new SecurityError('Invalid two-factor authentication code', 'INVALID_TWO_FACTOR');
    }
  }
  
  // Update last login
  userData.lastLogin = new Date();
  userData.ipAddress = ip;
  
  const user: AdminUser = {
    id: userData.id,
    email: userData.email,
    name: userData.name,
    role: userData.role,
    permissions: userData.permissions,
    lastLogin: userData.lastLogin,
    ipAddress: ip,
    twoFactorEnabled: userData.twoFactorEnabled
  };
  
  const token = createToken(user);
  recordLoginAttempt(ip, email, true, userAgent);

  return { user, token };
}

// Simplified TOTP verification (in production, use proper library like 'otplib')
function verifyTOTP(secret: string, code: string): boolean {
  // Demo implementation - in production use proper TOTP library
  // For demo purposes, accept specific codes
  const demoCode = '123456';
  return code === demoCode || code === '000000';
}

export function hasPermission(user: AdminUser, permission: string): boolean {
  if (user.permissions.includes('*')) {
    return true; // Super admin has all permissions
  }
  
  return user.permissions.includes(permission);
}

export function requirePermission(user: AdminUser, permission: string): void {
  if (!hasPermission(user, permission)) {
    throw new SecurityError(`Permission denied: ${permission}`, 'PERMISSION_DENIED');
  }
}

// Activity logging
export interface ActivityLog {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  resource: string;
  details?: any;
  ip: string;
  userAgent?: string;
  timestamp: Date;
}

const activityLogs: ActivityLog[] = [];

export function logActivity(
  user: AdminUser,
  action: string,
  resource: string,
  details?: any,
  ip?: string,
  userAgent?: string
): void {
  const log: ActivityLog = {
    id: Math.random().toString(36).substr(2, 9),
    userId: user.id,
    userEmail: user.email,
    action,
    resource,
    details,
    ip: ip || 'unknown',
    userAgent,
    timestamp: new Date()
  };
  
  activityLogs.push(log);
  
  // Keep only last 1000 logs (in production, store in database)
  if (activityLogs.length > 1000) {
    activityLogs.splice(0, activityLogs.length - 1000);
  }
  
  console.log(`[ACTIVITY] ${user.email} performed ${action} on ${resource}`);
}

export function getActivityLogs(limit = 100): ActivityLog[] {
  return activityLogs.slice(-limit).reverse();
}
