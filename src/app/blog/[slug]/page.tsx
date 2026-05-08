import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'

export const revalidate = 3600 // Cache for 1 hour

// Dynamic Metadata Generation for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const supabase = await createClient()
  
  const { data: post } = await supabase
    .from('posts')
    .select('title, meta_description, thumbnail')
    .eq('slug', resolvedParams.slug)
    .single()

  if (!post) {
    return {
      title: 'Không tìm thấy bài viết | Thuviendecor',
    }
  }

  return {
    title: `${post.title} | Thuviendecor`,
    description: post.meta_description,
    openGraph: {
      title: post.title,
      description: post.meta_description || '',
      images: post.thumbnail ? [post.thumbnail] : [],
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const supabase = await createClient()
  
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', resolvedParams.slug)
    .single()

  if (error || !post) {
    notFound()
  }
  
  return (
    <article className="container mx-auto p-8 max-w-3xl min-h-screen">
      <header className="mb-12 text-center">
        <div className="text-accent-gold font-semibold mb-4 uppercase tracking-wider">
          {new Date(post.created_at).toLocaleDateString('vi-VN')}
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-gray-900 leading-tight">
          {post.title}
        </h1>
        {post.thumbnail && (
          <div className="mt-8 rounded-2xl overflow-hidden shadow-lg w-full aspect-video bg-gray-100 relative">
            <Image
              src={post.thumbnail} 
              alt={post.title} 
              fill
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </header>
      
      <div className="prose prose-lg prose-gray max-w-none mx-auto prose-a:text-accent-gold hover:prose-a:text-gray-900">
        {post.content.split('\n').map((paragraph: string, index: number) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </article>
  )
}
