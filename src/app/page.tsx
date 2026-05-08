import React from 'react'
import { HeroSlider } from '@/components/ui/HeroSlider'
import { createClient } from '@/lib/supabase/server'
import { ResourceCard } from '@/components/ui/ResourceCard'

export const metadata = {
  title: 'DULI | Thư Viện Tài Nguyên Sự Kiện Số 1',
  description: 'Kho lưu trữ mô hình 3D, Vector 2D và PNG chất lượng cao dành riêng cho thiết kế sự kiện và tiệc cưới.',
}

export const revalidate = 3600 // Cache 1 hour

export default async function HomePage() {
  const supabase = await createClient()
  
  // Lấy 4 tài nguyên mới nhất để hiển thị nổi bật trên trang chủ
  const { data: latestResources } = await supabase
    .from('resources')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(4)

  return (
    <div className="w-full">
      {/* Khu vực Slider */}
      <section className="w-full bg-gray-900 pb-12">
        <HeroSlider />
      </section>

      {/* Khu vực Tài nguyên mới nhất */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">Tài Nguyên Mới Nhất</h2>
          <div className="w-24 h-1 bg-accent-gold mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Khám phá những thiết kế vừa được cập nhật vào thư viện của chúng tôi, 
            sẵn sàng cho dự án sự kiện tiếp theo của bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestResources && latestResources.length > 0 ? (
            latestResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-400 py-10">
              Hệ thống đang cập nhật dữ liệu...
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
