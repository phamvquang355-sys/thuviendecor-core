'use client'

import React, { useState } from 'react'
import { AdminUser, manualCreditUpdate, updateUserRole } from './adminActions'
import { Edit2, X, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

const USER_ROLES = ['USER', 'ADMIN', 'EDITOR'] as const
type UserRole = typeof USER_ROLES[number]

export default function UserTable({ initialUsers }: { initialUsers: AdminUser[] }) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers)
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [creditDelta, setCreditDelta] = useState<number>(0)
  const [newRole, setNewRole] = useState<'USER' | 'ADMIN' | 'EDITOR'>('USER')
  const [isLoading, setIsLoading] = useState(false)

  const openModal = (user: AdminUser) => {
    setSelectedUser(user)
    setCreditDelta(0)
    setNewRole(user.role)
    setIsModalOpen(true)
  }

  const handleSave = async () => {
    if (!selectedUser) return
    setIsLoading(true)

    // Update Role if changed
    if (newRole !== selectedUser.role) {
      await updateUserRole(selectedUser.id, newRole)
      // Update local state optimistic
      setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, role: newRole } : u))
    }

    // Manual credit update: cho phép cộng hoặc trừ credit
    if (creditDelta !== 0) {
      await manualCreditUpdate(selectedUser.id, creditDelta)
      // Update local state optimistic
      setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, credits: u.credits + creditDelta } : u))
    }

    setIsLoading(false)
    setIsModalOpen(false)
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-400">
          <thead className="bg-gray-950 text-gray-300 uppercase font-semibold border-b border-gray-800">
            <tr>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Credit</th>
              <th className="px-6 py-4">Vai trò</th>
              <th className="px-6 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-800/50 transition-colors">
                <td className="px-6 py-4 font-medium text-white">{user.email}</td>
                <td className="px-6 py-4 text-accent-gold font-bold">{user.credits} CR</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider ${
                    user.role === 'ADMIN' ? 'bg-red-900/30 text-red-400 border border-red-500/30' :
                    user.role === 'EDITOR' ? 'bg-blue-900/30 text-blue-400 border border-blue-500/30' :
                    'bg-gray-800 text-gray-400 border border-gray-700'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => openModal(user)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  Không tìm thấy người dùng nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
              <h3 className="text-xl font-bold text-white">Chỉnh sửa tài khoản</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email người dùng</label>
                <div className="px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-white font-medium">
                  {selectedUser.email}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Vai trò (Role)</label>
                <select 
                  value={newRole}
                  onChange={(e) => {
                    const selectedRole = e.target.value as UserRole
                    if (USER_ROLES.includes(selectedRole)) {
                      setNewRole(selectedRole)
                    }
                  }}
                  className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-accent-gold"
                >
                  <option value="USER">USER</option>
                  <option value="EDITOR">EDITOR</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Điều chỉnh Credit (+/-) (Hiện có: <span className="text-accent-gold">{selectedUser.credits}</span>)
                </label>
                <div className="relative">
                  <Plus className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input 
                    type="number" 
                    value={creditDelta}
                    onChange={(e) => setCreditDelta(Number(e.target.value))}
                    step="100"
                    className="w-full pl-10 pr-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-accent-gold"
                  />
                </div>
              </div>

              <div className="pt-4 flex space-x-4">
                <Button 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white border-none"
                >
                  Hủy
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex-1 bg-accent-gold hover:bg-accent-gold/90 text-black font-bold"
                >
                  {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
