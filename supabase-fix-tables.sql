-- Real-time kullanıcı aktivite takibi için düzeltilmiş tablolar

-- Önce mevcut tabloları sil (eğer varsa)
DROP TABLE IF EXISTS user_activities CASCADE;
DROP TABLE IF EXISTS user_online_status CASCADE;
DROP TABLE IF EXISTS user_sessions CASCADE;

-- 1. Kullanıcı aktiviteleri tablosu (user_id string olarak)
CREATE TABLE user_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  activity_type VARCHAR(50) NOT NULL CHECK (activity_type IN (
    'login', 'logout', 'page_view', 'product_view', 'cart_add', 
    'cart_remove', 'order_create', 'profile_update', 'search',
    'checkout_start', 'checkout_complete'
  )),
  page_url VARCHAR(500),
  product_id VARCHAR(255),
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_id VARCHAR(255),
  ip_address INET,
  user_agent TEXT
);

-- 2. Kullanıcı online durumu tablosu
CREATE TABLE user_online_status (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id VARCHAR(255) UNIQUE NOT NULL,
  is_online BOOLEAN DEFAULT false,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  current_page VARCHAR(500),
  session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_duration INTEGER DEFAULT 0, -- saniye cinsinden
  pages_visited JSONB DEFAULT '[]'::jsonb,
  cart_contents JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Kullanıcı session bilgileri tablosu
CREATE TABLE user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  session_id VARCHAR(255) UNIQUE NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_time TIMESTAMP WITH TIME ZONE,
  duration INTEGER, -- saniye cinsinden
  pages_visited JSONB DEFAULT '[]'::jsonb,
  activities_count INTEGER DEFAULT 0,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İndeksler (performans için)
CREATE INDEX idx_user_activities_user_id ON user_activities(user_id);
CREATE INDEX idx_user_activities_created_at ON user_activities(created_at DESC);
CREATE INDEX idx_user_activities_type ON user_activities(activity_type);
CREATE INDEX idx_user_online_status_user_id ON user_online_status(user_id);
CREATE INDEX idx_user_online_status_online ON user_online_status(is_online);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_session_id ON user_sessions(session_id);

-- RLS (Row Level Security) politikaları
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_online_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Admin erişimi için politikalar (tüm işlemler için izin)
CREATE POLICY "Allow all for service role" ON user_activities FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON user_online_status FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON user_sessions FOR ALL USING (true);

-- Otomatik güncelleme fonksiyonu
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger oluştur
CREATE TRIGGER update_user_online_status_updated_at 
  BEFORE UPDATE ON user_online_status 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Test veriler ekle
INSERT INTO user_activities (user_id, activity_type, page_url, created_at) VALUES
('1', 'login', '/admin/login', NOW() - INTERVAL '5 minutes'),
('1', 'page_view', '/admin/dashboard', NOW() - INTERVAL '4 minutes'),
('1', 'page_view', '/admin/users', NOW() - INTERVAL '3 minutes'),
('2', 'login', '/login', NOW() - INTERVAL '10 minutes'),
('2', 'page_view', '/products', NOW() - INTERVAL '8 minutes'),
('2', 'product_view', '/products/1', NOW() - INTERVAL '7 minutes'),
('2', 'cart_add', '/cart', NOW() - INTERVAL '6 minutes')
ON CONFLICT DO NOTHING;

INSERT INTO user_online_status (user_id, is_online, current_page, pages_visited) VALUES
('1', true, '/admin/dashboard', '["admin/login", "/admin/dashboard", "/admin/users"]'::jsonb),
('2', true, '/products', '["/login", "/products", "/products/1"]'::jsonb),
('3', false, '/home', '["/home", "/about"]'::jsonb)
ON CONFLICT (user_id) DO UPDATE SET
  is_online = EXCLUDED.is_online,
  current_page = EXCLUDED.current_page,
  pages_visited = EXCLUDED.pages_visited,
  updated_at = NOW();

-- Offline kullanıcıları otomatik işaretleme fonksiyonu
CREATE OR REPLACE FUNCTION mark_users_offline()
RETURNS void AS $$
BEGIN
  UPDATE user_online_status 
  SET is_online = false, updated_at = NOW()
  WHERE last_seen < NOW() - INTERVAL '5 minutes' AND is_online = true;
END;
$$ LANGUAGE plpgsql;

-- Eski kayıtları temizleme fonksiyonu (30 gün öncesi)
CREATE OR REPLACE FUNCTION cleanup_old_activities()
RETURNS void AS $$
BEGIN
  DELETE FROM user_activities 
  WHERE created_at < NOW() - INTERVAL '30 days';
  
  DELETE FROM user_sessions 
  WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;
