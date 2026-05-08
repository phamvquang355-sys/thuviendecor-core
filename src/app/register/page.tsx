'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { signup } from '@/src/app/auth/actions'
import { Button } from '@/components/ui/button'

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    const result = await signup(formData)
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-md p-8 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-black tracking-widest text-white hover:text-accent-gold transition-colors inline-block mb-2">
            DULI
          </Link>
          <h1 className="text-2xl font-bold text-gray-100">Tạo tài khoản mới</h1>
          <p className="text-gray-400 mt-2">Trở thành thành viên để tải xuống hàng ngàn tài nguyên.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}

        <form action={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-gold focus:border-transparent transition-all"
              placeholder="you@example.com"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300" htmlFor="password">
              Mật khẩu
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-gold focus:border-transparent transition-all"
              placeholder="Tối thiểu 6 ký tự"
            />
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-12 bg-white hover:bg-gray-200 text-gray-900 font-bold text-lg rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Đang xử lý...' : 'Đăng ký miễn phí'}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-400">
          Đã có tài khoản?{' '}
          <Link href="/login" className="text-accent-gold hover:underline font-semibold">
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  )
}
