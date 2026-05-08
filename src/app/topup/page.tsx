'use client'

import React, { useState } from 'react'
import { Coins, CheckCircle2, X } from 'lucide-react'
import { useCreditStore } from '@/store/creditStore'
import { createTopupTransaction } from '@/src/app/topup/actions'
import { Button } from '@/components/ui/button'

const PACKAGES = [
  { id: 1, price: 50000, credits: 500, label: 'Gói Cơ bản' },
  { id: 2, price: 100000, credits: 1000, label: 'Gói Phổ biến', isPopular: true },
  { id: 3, price: 450000, credits: 5000, label: 'Gói Chuyên nghiệp' },
]

// Cấu hình ngân hàng (có thể đổi sau)
const BANK_INFO = {
  bankName: 'MB Bank',
  accountNo: '0123456789',
  accountName: 'DULI PLATFORM',
}

export default function TopupPage() {
  const balance = useCreditStore((state) => state.balance)
  const [selectedPackage, setSelectedPackage] = useState<typeof PACKAGES[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [successCode, setSuccessCode] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSelectPackage = (pkg: typeof PACKAGES[0]) => {
    setSelectedPackage(pkg)
    setSuccessCode(null)
    setErrorMsg(null)
    setIsModalOpen(true)
  }

  const handleConfirmTransaction = async () => {
    if (!selectedPackage) return
    setIsLoading(true)
    setErrorMsg(null)
    
    const result = await createTopupTransaction(selectedPackage.price)
    
    if (result.error) {
      setErrorMsg(result.error)
    } else if (result.success && result.referenceCode) {
      setSuccessCode(result.referenceCode)
    }
    
    setIsLoading(false)
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
                className={`w-full h-14 text-lg font-bold rounded-xl transition-all
                  ${pkg.isPopular 
                    ? 'bg-accent-gold hover:bg-accent-gold/90 text-black shadow-[0_0_15px_rgba(212,175,55,0.4)] hover:shadow-[0_0_25px_rgba(212,175,55,0.6)]' 
                    : 'bg-white hover:bg-gray-200 text-black'
                  }
                `}
              >
                Mua ngay {formatCurrency(pkg.price)}
              </Button>
            </div>
          ))}
        </div>

        {/* Payment Modal */}
        {isModalOpen && selectedPackage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
              onClick={() => !isLoading && setIsModalOpen(false)}
            ></div>
            
            {/* Modal Content */}
            <div className="relative bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-lg p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
                disabled={isLoading}
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-2xl font-bold mb-6">Thanh toán chuyển khoản</h2>

              {successCode ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Yêu cầu đã được ghi nhận!</h3>
                  <p className="text-gray-400 mb-6">Vui lòng chờ Admin kiểm tra và cộng Credit cho bạn nhé. Mã giao dịch của bạn là:</p>
                  <div className="bg-gray-950 border border-gray-800 rounded-xl py-4 px-6 inline-block font-mono text-2xl text-accent-gold tracking-widest font-bold">
                    {successCode}
                  </div>
                  <Button 
                    onClick={() => setIsModalOpen(false)}
                    className="w-full mt-8 bg-gray-800 hover:bg-gray-700 text-white rounded-xl"
                  >
                    Đóng
                  </Button>
                </div>
              ) : (
                <>
                  <div className="bg-gray-950 rounded-2xl p-6 mb-6 border border-gray-800">
                    <div className="flex justify-center mb-6">
                      {/* VietQR integration */}
                      <div className="bg-white p-2 rounded-xl">
                        <img 
                          src={`https://img.vietqr.io/image/MB-0123456789-compact2.png?amount=${selectedPackage.price}&addInfo=NAP DULI`} 
                          alt="QR Code" 
                          className="w-48 h-48 object-contain"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between border-b border-gray-800 pb-2">
                        <span className="text-gray-500">Ngân hàng</span>
                        <span className="font-bold text-white">{BANK_INFO.bankName}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-800 pb-2">
                        <span className="text-gray-500">Số tài khoản</span>
                        <span className="font-bold text-white tracking-widest">{BANK_INFO.accountNo}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-800 pb-2">
                        <span className="text-gray-500">Chủ tài khoản</span>
                        <span className="font-bold text-white uppercase">{BANK_INFO.accountName}</span>
                      </div>
                      <div className="flex justify-between pt-1">
                        <span className="text-gray-500">Số tiền chuyển</span>
                        <span className="font-bold text-accent-gold text-lg">{formatCurrency(selectedPackage.price)}</span>
                      </div>
                      <div className="flex justify-between pt-1">
                        <span className="text-gray-500">Nội dung (Bắt buộc)</span>
                        <span className="font-bold text-white uppercase">NAP DULI</span>
                      </div>
                    </div>
                  </div>

                  {errorMsg && (
                    <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-200 text-sm">
                      {errorMsg}
                    </div>
                  )}

                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-6 italic">
                      Lưu ý: Bạn phải chuyển khoản thành công trước khi nhấn nút xác nhận bên dưới.
                    </p>
                    <Button 
                      onClick={handleConfirmTransaction}
                      disabled={isLoading}
                      className="w-full h-14 bg-accent-gold hover:bg-accent-gold/90 text-black font-bold text-lg rounded-xl shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all hover:shadow-[0_0_25px_rgba(212,175,55,0.6)] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Đang xử lý...' : 'Xác nhận đã chuyển khoản'}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
