"use client"

import React, { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Coins, LogOut, User } from 'lucide-react'
import { useCreditStore } from '@/store/creditStore'
import { createClient } from '@/lib/supabase/client'
import { logout } from '@/src/app/auth/actions'
import { APP_ROUTES } from '@/lib/constants/routes'
import { User as SupabaseUser } from '@supabase/supabase-js'

export function Header() {
  const { balance, setBalance } = useCreditStore()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [role, setRole] = useState<'USER' | 'ADMIN' | 'EDITOR'>('USER')
  const [loading, setLoading] = useState(true)
  const [supabase] = useState(() => createClient())

  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('credits, role')
      .eq('id', userId)
      .single()

    if (!error && data) {
      setBalance(data.credits)
      setRole(data.role)
    } else {
      setBalance(0)
      setRole('USER')
    }
    setLoading(false)
  }, [setBalance, supabase])

  useEffect(() => {
    // Lấy session ban đầu
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    }

    fetchSession()

    // Lắng nghe thay đổi trạng thái
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null)
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
          window.location.href = APP_ROUTES.home
          return
        }
        if (session?.user) {
          fetchProfile(session.user.id)
        } else {
          setBalance(0)
          setRole('USER')
          setLoading(false)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [fetchProfile, setBalance, supabase.auth])

  const handleLogout = async () => {
    await logout()
    window.location.href = APP_ROUTES.login
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-gray-900 border-b border-gray-800">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 group">
          <span className="text-2xl font-black tracking-widest text-white group-hover:text-accent-gold transition-colors duration-300">
            DULI
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-300">
          <Link href="/library" className="hover:text-accent-gold transition-colors duration-200">Thư viện</Link>
          <Link href="/blog" className="hover:text-accent-gold transition-colors duration-200">Blog</Link>
        </nav>

        <div className="flex items-center">
          {!loading && (
            user ? (
              <div className="flex items-center space-x-4">
                {role === 'ADMIN' && (
                  <Link 
                    href={APP_ROUTES.admin}
                    className="px-4 py-1.5 rounded-full border border-accent-gold bg-accent-gold text-black hover:bg-accent-gold/90 transition-colors text-sm font-semibold whitespace-nowrap shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                  >
                    Dashboard
                  </Link>
                )}
                <Link 
                  href={APP_ROUTES.napcredit}
                  className="px-4 py-1.5 rounded-full border border-accent-gold text-accent-gold hover:bg-accent-gold hover:text-black transition-colors text-sm font-semibold whitespace-nowrap"
                >
                  Nạp Credit
                </Link>
                <div className="flex items-center bg-gray-800/80 px-4 py-2 rounded-full border border-gray-700 shadow-inner">
                  <Coins className="w-5 h-5 text-accent-gold mr-2 drop-shadow-sm" />
                  <span className="text-white font-bold tracking-wide">
                    {balance} <span className="text-gray-400 font-normal text-xs ml-1">CR</span>
                  </span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-white transition-colors"
                  title="Đăng xuất"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link 
                href={APP_ROUTES.login}
                className="flex items-center px-5 py-2 rounded-full border border-accent-gold text-accent-gold hover:bg-accent-gold hover:text-black transition-colors font-semibold text-sm"
              >
                <User className="w-4 h-4 mr-2" />
                Đăng nhập
              </Link>
            )
          )}
        </div>
      </div>
    </header>
  )
}
