import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cnxiieeblxkzwbuzhusa.supabase.co', // Tên miền từ lỗi của bạn
        port: '',
        pathname: '/storage/v1/object/public/**', // Cho phép tất cả ảnh công khai
      },
    ],
  },
  /* các cấu hình khác nếu có */
};

export default nextConfig;