import React from 'react'
import Link from 'next/link'
import { LayoutDashboard, Users, Box, FileText, LogOut } from 'lucide-react'
import { redirect } from 'next/navigation'
import { logout } from '@/src/app/auth/actions'
import { APP_ROUTES } from '@/lib/constants/routes'

const NAV_ITEMS = [
  { href: APP_ROUTES.admin, label: 'Tổng quan', icon: LayoutDashboard },
  { href: `${APP_ROUTES.admin}/users`, label: 'Tài khoản', icon: Users },
  { href: `${APP_ROUTES.admin}/resources`, label: 'Thư viện', icon: Box },
  { href: `${APP_ROUTES.admin}/blog`, label: 'Bài viết', icon: FileText },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  async function handleAdminLogout() {
    'use server'
    await logout()
    redirect(APP_ROUTES.login)
  }

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col fixed h-full z-10">
        <div className="h-16 flex items-center justify-center border-b border-gray-800 px-6">
          <Link href={APP_ROUTES.home} className="text-2xl font-black tracking-widest text-white hover:text-accent-gold transition-colors">
            DULI <span className="text-sm font-medium text-accent-gold ml-1">ADMIN</span>
          </Link>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white transition-all group"
              >
                <Icon className="w-5 h-5 group-hover:text-accent-gold transition-colors" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <form action={handleAdminLogout}>
            <button 
              type="submit"
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-900/20 text-red-400 hover:bg-red-900/40 hover:text-red-300 rounded-xl transition-all font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span>Đăng xuất</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  )
}
