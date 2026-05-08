import React from 'react'

export default function AdminBlogPage() {
  return (
    <div className="text-white">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Quản lý Bài viết</h1>
          <p className="text-gray-400">Soạn thảo, chỉnh sửa và đăng bài lên Blog DULI.</p>
        </div>
        <button className="px-6 py-2 bg-accent-gold text-black font-bold rounded-xl shadow-lg hover:bg-accent-gold/90 transition-colors">
          + Viết bài mới
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center text-gray-500">
        Tính năng Quản lý Bài viết đang được phát triển trong Giai đoạn tiếp theo.
      </div>
    </div>
  )
}
