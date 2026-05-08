'use client'

import React, { Suspense, useMemo, useState } from 'react'
import { Coins, AlertCircle } from 'lucide-react'
import { useCreditStore } from '@/store/creditStore'
import { createPaymentLink } from '@/src/app/napcredit/actions'
import { Button } from '@/components/ui/button'
import { useSearchParams } from 'next/navigation'

const PACKAGES = [
  { id: 1, price: 50000, credits: 500, label: 'Gói Cơ bản' },
  { id: 2, price: 100000, credits: 1000, label: 'Gói Phổ biến', isPopular: true },
  { id: 3, price: 450000, credits: 5000, label: 'Gói Chuyên nghiệp' },
]

function NapCreditContent() {
  const balance = useCreditStore((state) => state.balance)
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const searchParams = useSearchParams()

  const statusNotice = useMemo(() => {
    if (searchParams.get('status') === 'success') {
      return { type: 'success' as const, message: 'Thanh toán thành công! Hệ thống đang xử lý và cộng Credit cho bạn.' }
    }
    if (searchParams.get('cancel') === 'true') {
      return { type: 'error' as const, message: 'Giao dịch đã bị hủy.' }
    }
    return null
  }, [searchParams])

  const handleSelectPackage = async (pkg: typeof PACKAGES[0]) => {
    setIsLoading(true)
    setSubmitError(null)
    
    const formData = new FormData()
    formData.append('amount', pkg.price.toString())
    
    try {
      const result = await createPaymentLink(formData)
      if (result?.error) {
        setSubmitError(result.error)
        setIsLoading(false)
      }
      // If success, it redirects, so we don't need to setIsLoading(false)
    } catch {
      setSubmitError('Đã có lỗi xảy ra. Vui lòng thử lại.')
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <header className="mb-16 flex flex-col md:flex-row justify-between items-center gap-6 border-b border-gray-800 pb-8">
          <div>
            <h1 className="text-4xl font-black mb-2 tracking-tight">Nạp Credit</h1>
            <p className="text-gray-400">Chọn gói phù hợp để tải xuống hàng ngàn tài nguyên sự kiện.</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 px-6 py-4 rounded-2xl flex items-center shadow-lg">
            <span className="text-gray-400 font-medium mr-4">Số dư hiện tại:</span>
            <Coins className="w-6 h-6 text-accent-gold mr-2" />
            <span className="text-2xl font-bold">{balance} <span className="text-sm font-normal text-gray-500">CR</span></span>
          </div>
        </header>

        {statusNotice?.type === 'error' && (
          <div className="mb-8 p-4 bg-red-900/30 border border-red-500/50 rounded-lg flex items-center text-red-200">
            <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
            {statusNotice.message}
          </div>
        )}

        {submitError && (
          <div className="mb-8 p-4 bg-red-900/30 border border-red-500/50 rounded-lg flex items-center text-red-200">
            <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
            {submitError}
          </div>
        )}

        {statusNotice?.type === 'success' && (
          <div className="mb-8 p-4 bg-green-900/30 border border-green-500/50 rounded-lg flex items-center text-green-200">
            <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
            {statusNotice.message}
          </div>
        )}

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-0">
          {PACKAGES.map((pkg) => (
            <div 
              key={pkg.id} 
              className={`relative bg-gray-900 rounded-3xl p-8 border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col h-full
                ${pkg.isPopular ? 'border-accent-gold shadow-[0_0_30px_rgba(212,175,55,0.15)]' : 'border-gray-800 hover:border-gray-600'}
              `}
            >
              {pkg.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent-gold text-black font-bold px-4 py-1 rounded-full text-sm shadow-md">
                  Phổ biến nhất
                </div>
              )}
              
              <div className="text-center mb-8 flex-grow">
                <h3 className="text-xl text-gray-400 font-medium mb-4">{pkg.label}</h3>
                <div className="flex items-center justify-center text-5xl font-black text-white mb-2">
                  {pkg.credits} <span className="text-xl text-accent-gold ml-2">CR</span>
                </div>
              </div>
              
              <Button 
                onClick={() => handleSelectPackage(pkg)}
                disabled={isLoading}
                className={`w-full h-14 text-lg font-bold rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed
                  ${pkg.isPopular 
                    ? 'bg-accent-gold hover:bg-accent-gold/90 text-black shadow-[0_0_15px_rgba(212,175,55,0.4)] hover:shadow-[0_0_25px_rgba(212,175,55,0.6)]' 
                    : 'bg-white hover:bg-gray-200 text-black'
                  }
                `}
              >
                {isLoading ? 'Đang xử lý...' : `Mua ngay ${formatCurrency(pkg.price)}`}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function NapCreditPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-950" />}>
      <NapCreditContent />
    </Suspense>
  )
}
