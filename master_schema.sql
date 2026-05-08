-- ==============================================================================
-- DULI PROJECT - MASTER DATABASE SCHEMA
-- ==============================================================================

-- 1. Xóa các bảng cũ (theo thứ tự để tránh lỗi khóa ngoại)
DROP TABLE IF EXISTS public.transactions CASCADE;
DROP TABLE IF EXISTS public.posts CASCADE;
DROP TABLE IF EXISTS public.resources CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. Xóa các kiểu dữ liệu Enum cũ
DROP TYPE IF EXISTS public.resource_category CASCADE;
DROP TYPE IF EXISTS public.transaction_type CASCADE;
DROP TYPE IF EXISTS public.transaction_status CASCADE;

-- 3. Tạo kiểu dữ liệu Enum
CREATE TYPE public.resource_category AS ENUM ('3D', '2D', 'PNG');
CREATE TYPE public.transaction_type AS ENUM ('purchase', 'topup');
CREATE TYPE public.transaction_status AS ENUM ('pending', 'completed', 'failed', 'cancelled');

-- ==============================================================================
-- BẢNG DỮ LIỆU (TABLES) - TẠO THEO THỨ TỰ ĐỂ TRÁNH LỖI "RELATION DOES NOT EXIST"
-- ==============================================================================

-- Bảng 1: profiles (Quản lý người dùng và số dư credit)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    credits INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Bảng 2: resources (Kho tài nguyên thiết kế)
CREATE TABLE public.resources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category public.resource_category NOT NULL,
    price_credits INTEGER NOT NULL DEFAULT 0,
    preview_url TEXT,
    download_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Bảng 3: transactions (Lịch sử giao dịch)
CREATE TABLE public.transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    resource_id UUID REFERENCES public.resources(id) ON DELETE SET NULL,
    amount INTEGER NOT NULL,
    type public.transaction_type NOT NULL,
    status public.transaction_status NOT NULL DEFAULT 'pending',
    reference_code TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Bảng 4: posts (Bài viết Blog chuẩn SEO)
CREATE TABLE public.posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    thumbnail TEXT,
    meta_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- CHỈ MỤC (INDEXES) ĐỂ TỐI ƯU TRUY VẤN
-- ==============================================================================
CREATE INDEX resources_slug_idx ON public.resources (slug);
CREATE INDEX posts_slug_idx ON public.posts (slug);
CREATE INDEX transactions_profile_id_idx ON public.transactions (profile_id);
CREATE INDEX transactions_reference_code_idx ON public.transactions (reference_code);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Cho phép mọi người xem tài nguyên" ON public.resources FOR SELECT USING (true);
CREATE POLICY "Cho phép mọi người xem bài viết blog" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Users có thể xem profile của chính họ" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users có thể xem lịch sử giao dịch của chính họ" ON public.transactions FOR SELECT USING (auth.uid() = profile_id);

-- Lưu ý: Khi có giao dịch topup hoặc purchase, Service Role sẽ thực hiện INSERT/UPDATE (vượt qua RLS).
