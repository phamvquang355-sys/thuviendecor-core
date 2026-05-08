import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { ResourceCard } from '@/components/ui/ResourceCard'

export const metadata = {
  title: 'Thư Viện Tài Nguyên | Thuviendecor',
  description: 'Tải xuống các tài nguyên thiết kế 3D, 2D, PNG chất lượng cao.',
}

export const revalidate = 60 // Revalidate every 60 seconds

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const supabase = await createClient()
  const resolvedParams = await searchParams
  const categoryFilter = resolvedParams.category
  
  let query = supabase.from('resources').select('*').order('created_at', { ascending: false })
  
  if (categoryFilter && ['3D', '2D', 'PNG'].includes(categoryFilter)) {
    query = query.eq('category', categoryFilter as '3D' | '2D' | 'PNG')
  }

  const { data: resources, error } = await query

  return (
    <div className="container mx-auto p-8">
      <header className="mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-gray-900">
          Thư Viện Tài Nguyên
        </h1>
        <p className="text-lg text-gray-600">
          Khám phá bộ sưu tập tài nguyên 3D, 2D và PNG chất lượng cao dành riêng cho thiết kế sự kiện và tiệc cưới.
        </p>
      </header>

      {/* Masonry Grid bằng CSS columns */}
      {error ? (
        <div className="text-center text-red-500 py-10">Lỗi tải dữ liệu. Vui lòng thử lại sau.</div>
      ) : resources && resources.length > 0 ? (
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <p className="text-xl font-medium mb-2">Chưa có tài nguyên nào</p>
          <p>Hãy chọn danh mục khác hoặc quay lại sau nhé.</p>
        </div>
      )}
    </div>
  )
}
