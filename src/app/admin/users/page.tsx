import React from 'react'
import { fetchAllUsers } from './adminActions'
import UserTable from './UserTable'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
  const users = await fetchAllUsers()

  return (
    <div className="text-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Quản lý Tài khoản</h1>
        <p className="text-gray-400">Xem danh sách người dùng, thay đổi quyền hạn và nạp Credit thủ công.</p>
      </div>

      <UserTable initialUsers={users} />
    </div>
  )
}
