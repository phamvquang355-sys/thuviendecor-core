import React from 'react'
import { Users, Box, CreditCard } from 'lucide-react'

export default function AdminDashboardPage() {
  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-8">Tổng quan hệ thống</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl flex items-center shadow-lg">
          <div className="w-14 h-14 bg-blue-900/30 rounded-xl flex items-center justify-center mr-4">
            <Users className="w-7 h-7 text-blue-400" />
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium">Tổng người dùng</p>
            <p className="text-3xl font-bold">---</p>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl flex items-center shadow-lg">
          <div className="w-14 h-14 bg-green-900/30 rounded-xl flex items-center justify-center mr-4">
            <CreditCard className="w-7 h-7 text-green-400" />
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium">Giao dịch chờ xử lý</p>
            <p className="text-3xl font-bold">---</p>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl flex items-center shadow-lg">
          <div className="w-14 h-14 bg-purple-900/30 rounded-xl flex items-center justify-center mr-4">
            <Box className="w-7 h-7 text-purple-400" />
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium">Tài nguyên thư viện</p>
            <p className="text-3xl font-bold">---</p>
          </div>
        </div>
      </div>
    </div>
  )
}
