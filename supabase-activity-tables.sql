-- Kullanıcı Aktivite Takibi için Supabase Tabloları
-- Bu SQL'i Supabase Dashboard > SQL Editor'da çalıştırın

-- 1. Kullanıcı Aktiviteleri Tablosu
CREATE TABLE IF NOT EXISTS user_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  activity_type VARCHAR(50) NOT NULL CHECK (activity_type IN (
    'login', 'logout', 'page_view', 'product_view', 'cart_add',
    'cart_remove', 'order_create', 'profile_update', 'search',
    'checkout_start', 'checkout_complete'
  )),
  page_url TEXT,
  product_id VARCHAR(255),
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  session_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Online Kullanıcı Durumu Tablosu
CREATE TABLE IF NOT EXISTS user_online_status (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  current_page TEXT,
  is_online BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. İndeksler (Performans için)
CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_created_at ON user_activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_activities_type ON user_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_user_online_status_online ON user_online_status(is_online) WHERE is_online = TRUE;
CREATE INDEX IF NOT EXISTS idx_user_online_status_last_seen ON user_online_status(last_seen DESC);

-- 4. RLS (Row Level Security) Politikaları
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_online_status ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar sadece kendi aktivitelerini görebilir
CREATE POLICY "Users can view own activities" ON user_activities
  FOR SELECT USING (auth.uid() = user_id);

-- Kullanıcılar kendi aktivitelerini ekleyebilir
CREATE POLICY "Users can insert own activities" ON user_activities
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Kullanıcılar kendi online durumlarını görebilir
CREATE POLICY "Users can view own online status" ON user_online_status
  FOR SELECT USING (auth.uid() = user_id);

-- Kullanıcılar kendi online durumlarını güncelleyebilir
CREATE POLICY "Users can update own online status" ON user_online_status
  FOR ALL USING (auth.uid() = user_id);

-- Admin'ler tüm aktiviteleri görebilir (users tablosunda role kontrolü)
CREATE POLICY "Admins can view all activities" ON user_activities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'manager')
    )
  );

-- Admin'ler tüm online durumları görebilir
CREATE POLICY "Admins can view all online status" ON user_online_status
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'manager')
    )
  );

-- 5. Trigger: Online status güncellendiğinde updated_at'i güncelle
CREATE OR REPLACE FUNCTION update_online_status_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_online_status_updated_at
  BEFORE UPDATE ON user_online_status
  FOR EACH ROW
  EXECUTE FUNCTION update_online_status_updated_at();

-- 6. Otomatik temizlik fonksiyonu (eski aktiviteleri sil)
CREATE OR REPLACE FUNCTION cleanup_old_activities()
RETURNS void AS $$
BEGIN
  -- 30 günden eski aktiviteleri sil
  DELETE FROM user_activities 
  WHERE created_at < NOW() - INTERVAL '30 days';
  
  -- 1 saatten uzun offline olan kullanıcıları offline yap
  UPDATE user_online_status 
  SET is_online = FALSE 
  WHERE is_online = TRUE 
  AND last_seen < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql;

-- 7. Cron job için temizlik (Supabase'de pg_cron extension gerekli)
-- SELECT cron.schedule('cleanup-activities', '0 2 * * *', 'SELECT cleanup_old_activities();');

-- 8. Aktivite türleri için enum (opsiyonel)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'activity_type_enum') THEN
    CREATE TYPE activity_type_enum AS ENUM (
      'login', 
      'logout', 
      'page_view', 
      'product_view', 
      'cart_add', 
      'order_create', 
      'profile_update'
    );
  END IF;
END $$;

-- 9. Aktivite istatistikleri için view
CREATE OR REPLACE VIEW user_activity_stats AS
SELECT 
  u.id as user_id,
  u.email,
  u.first_name,
  u.last_name,
  COUNT(ua.id) as total_activities,
  COUNT(CASE WHEN ua.activity_type = 'login' THEN 1 END) as login_count,
  COUNT(CASE WHEN ua.activity_type = 'page_view' THEN 1 END) as page_views,
  COUNT(CASE WHEN ua.activity_type = 'product_view' THEN 1 END) as product_views,
  COUNT(CASE WHEN ua.activity_type = 'cart_add' THEN 1 END) as cart_additions,
  COUNT(CASE WHEN ua.activity_type = 'order_create' THEN 1 END) as orders_created,
  MAX(ua.created_at) as last_activity,
  uo.is_online,
  uo.current_page,
  uo.last_seen
FROM users u
LEFT JOIN user_activities ua ON u.id = ua.user_id
LEFT JOIN user_online_status uo ON u.id = uo.user_id
GROUP BY u.id, u.email, u.first_name, u.last_name, uo.is_online, uo.current_page, uo.last_seen;

-- 10. Gerçek zamanlı aktivite için view
CREATE OR REPLACE VIEW real_time_activities AS
SELECT 
  ua.*,
  u.email,
  u.first_name,
  u.last_name,
  u.role
FROM user_activities ua
JOIN users u ON ua.user_id = u.id
WHERE ua.created_at >= NOW() - INTERVAL '1 hour'
ORDER BY ua.created_at DESC;

-- Başarı mesajı
SELECT 'Aktivite takibi tabloları başarıyla oluşturuldu!' as message;
