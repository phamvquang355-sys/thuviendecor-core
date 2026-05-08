import React from 'react'
import Link from 'next/link'

export default function LibraryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className="min-h-screen bg-white text-gray-900">
      <nav className="border-b sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <div className="container mx-auto px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link href="/library" className="font-bold text-xl tracking-tight">Thuviendecor</Link>
          <div className="flex flex-wrap gap-2 sm:gap-4 font-medium text-sm">
            <Link href="/library" className="px-4 py-2 rounded-full hover:bg-gray-100 transition-colors">Tất cả</Link>
            <Link href="/library?category=3D" className="px-4 py-2 rounded-full hover:bg-gray-100 transition-colors">Mô hình 3D</Link>
            <Link href="/library?category=2D" className="px-4 py-2 rounded-full hover:bg-gray-100 transition-colors">Vector 2D</Link>
            <Link href="/library?category=PNG" className="px-4 py-2 rounded-full hover:bg-gray-100 transition-colors">Ảnh PNG</Link>
          </div>
        </div>
      </nav>
      {children}
    </section>
  )
}
