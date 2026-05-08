-- Tạo bảng resources: Lưu file 3D/2D/PNG
CREATE TABLE IF NOT EXISTS public.resources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    credit_price INTEGER NOT NULL DEFAULT 0,
    file_url TEXT NOT NULL,
    is_valid BOOLEAN NOT NULL DEFAULT true, -- Dùng để xác định tài nguyên hợp lệ/công khai
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tạo bảng posts: Lưu bài viết Blog
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL, -- Nội dung markdown
    slug TEXT NOT NULL UNIQUE, -- Slug SEO
    is_published BOOLEAN NOT NULL DEFAULT false, -- Dùng để xác định bài viết công khai
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tạo bảng profiles: Quản lý ví Credit khách hàng
-- (Thường sẽ liên kết với auth.users nếu dùng Supabase)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY, -- Khớp với ID của người dùng (ví dụ: auth.users.id)
    credit_balance INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- THIẾT LẬP ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Bật RLS cho tất cả các bảng
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 1. RLS cho bảng resources: Khách (và user) chỉ xem được tài nguyên hợp lệ (is_valid = true)
CREATE POLICY "Cho phép mọi người xem tài nguyên hợp lệ" 
ON public.resources 
FOR SELECT 
USING (is_valid = true);

-- 2. RLS cho bảng posts: Khách (và user) chỉ xem được bài viết công khai (is_published = true)
CREATE POLICY "Cho phép mọi người xem bài viết công khai" 
ON public.posts 
FOR SELECT 
USING (is_published = true);

-- 3. RLS cho bảng profiles: User chỉ có thể xem profile (số dư credit) của chính mình
-- Lưu ý: Tùy thuộc vào hệ thống Auth bạn dùng (ví dụ Supabase auth.uid())
CREATE POLICY "Users có thể xem profile của chính mình" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Lưu ý thêm: Bạn sẽ cần tạo thêm các Policy cho thao tác INSERT/UPDATE/DELETE 
-- dành cho vai trò Quản trị viên (Admin) sau này.
