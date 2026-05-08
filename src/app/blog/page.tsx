import React from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Blog Kiến Thức & Tin Tức | Thuviendecor',
  description: 'Cập nhật tin tức và kiến thức mới nhất về thiết kế.',
}

export const revalidate = 3600 // Revalidate cache every hour

export default async function BlogPage() {
  const supabase = await createClient()
  
  const { data: posts, error } = await supabase
    .from('posts')
    .select('title, slug, meta_description, created_at')
    .order('created_at', { ascending: false })

  return (
    <div className="container mx-auto p-8 max-w-4xl min-h-screen">
      <h1 className="text-4xl font-extrabold tracking-tight mb-12 text-center text-gray-900">
        Tin tức & Bài viết
      </h1>
      
      <div className="space-y-10">
        {error ? (
          <div className="text-red-500">Đã có lỗi xảy ra khi tải bài viết.</div>
        ) : posts && posts.length > 0 ? (
          posts.map((post) => (
            <article key={post.slug} className="group pb-8 border-b border-gray-200">
              <div className="text-sm text-accent-gold font-semibold mb-2 uppercase tracking-wider">
                {new Date(post.created_at).toLocaleDateString('vi-VN')}
              </div>
              <h2 className="text-3xl font-bold mb-3 text-gray-900 transition-colors group-hover:text-accent-gold">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="text-gray-600 mb-4 text-lg leading-relaxed">
                {post.meta_description || 'Nhấn vào để đọc chi tiết bài viết này.'}
              </p>
              <Link 
                href={`/blog/${post.slug}`} 
                className="inline-block font-medium text-gray-900 hover:text-accent-gold transition-colors"
              >
                Đọc thêm →
              </Link>
            </article>
          ))
        ) : (
          <div className="text-gray-500 text-center py-10">
            Chưa có bài viết nào được đăng tải.
          </div>
        )}
      </div>
    </div>
  )
}
