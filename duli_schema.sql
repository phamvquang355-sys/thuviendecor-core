-- ==============================================================================
-- DULI PROJECT - DATABASE SCHEMA
-- ==============================================================================

-- 1. Tạo kiểu dữ liệu Enum cho category của resources
CREATE TYPE public.resource_category AS ENUM ('3D', '2D', 'PNG');
CREATE TYPE public.transaction_type AS ENUM ('purchase', 'topup');

-- ==============================================================================
-- BẢNG DỮ LIỆU (TABLES)
-- ==============================================================================

-- Bảng profiles: Quản lý người dùng và số dư credit
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    credits INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Bảng resources: Kho tài nguyên thiết kế
CREATE TABLE IF NOT EXISTS public.resources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category public.resource_category NOT NULL,
    price_credits INTEGER NOT NULL DEFAULT 0,
    preview_url TEXT,
    download_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Bảng posts: Bài viết Blog chuẩn SEO
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    thumbnail TEXT,
    meta_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Bảng transactions: Lịch sử giao dịch (Audit Log)
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    resource_id UUID REFERENCES public.resources(id) ON DELETE SET NULL,
    amount INTEGER NOT NULL, -- Âm: trừ credit mua hàng, Dương: cộng credit
    type public.transaction_type NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- CHỈ MỤC (INDEXES) ĐỂ TỐI ƯU SEO VÀ TRUY VẤN
-- ==============================================================================

-- Index cho các trường slug (dùng cho tìm kiếm bài viết, tài nguyên qua URL)
CREATE INDEX IF NOT EXISTS resources_slug_idx ON public.resources (slug);
CREATE INDEX IF NOT EXISTS posts_slug_idx ON public.posts (slug);
CREATE INDEX IF NOT EXISTS transactions_profile_id_idx ON public.transactions (profile_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ==============================================================================

-- Bật RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- 1. Policies cho resources và posts (Public Read)
CREATE POLICY "Cho phép mọi người xem tài nguyên" 
ON public.resources FOR SELECT USING (true);

CREATE POLICY "Cho phép mọi người xem bài viết blog" 
ON public.posts FOR SELECT USING (true);

-- 2. Policies cho profiles (Owner Read Only)
CREATE POLICY "Users có thể xem profile của chính họ" 
ON public.profiles FOR SELECT USING (auth.uid() = id);

-- (Quyền Update/Insert profiles do Service Role xử lý thông qua Edge Functions, 
-- Service Role tự động vượt qua RLS, nên không cần viết Policy Update ở đây)

-- 3. Policies cho transactions (Owner Read Only)
CREATE POLICY "Users có thể xem lịch sử giao dịch của chính họ" 
ON public.transactions FOR SELECT USING (auth.uid() = profile_id);

-- Lưu ý thêm: Supabase có sẵn Trigger và Functions nếu bạn muốn tự động 
-- tạo record trong public.profiles mỗi khi có user mới đăng ký qua auth.users.
-- (Bỏ qua trong file này để giữ cấu trúc tinh gọn cho việc khởi tạo bảng).
