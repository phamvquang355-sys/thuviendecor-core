'use server'

import { createClient } from '@/lib/supabase/server'
import { payOSClient } from '@/lib/payos/client'
import { redirect } from 'next/navigation'
import { APP_ROUTES } from '@/lib/constants/routes'

export async function createPaymentLink(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const amount = Number(formData.get('amount'))
  const description = `Nap Credit DULI ${user.email?.split('@')[0]}`
  const orderCode = Number(String(Date.now()).slice(-6)) // Tạo mã đơn hàng số

  const body = {
    orderCode,
    amount,
    description: description.slice(0, 25), // PayOS giới hạn 25 ký tự
    cancelUrl: `${process.env.NEXT_PUBLIC_DOMAIN}${APP_ROUTES.napcredit}`,
    returnUrl: `${process.env.NEXT_PUBLIC_DOMAIN}${APP_ROUTES.napcredit}?status=success`,
  }

  try {
    const paymentLinkRes = await payOSClient.paymentRequests.create(body)

    // Lưu giao dịch vào bảng transactions ở trạng thái pending
    await supabase.from('transactions').insert({
      profile_id: user.id,
      amount: amount,
      type: 'topup',
      status: 'pending',
      reference_code: orderCode.toString()
    })

    return redirect(paymentLinkRes.checkoutUrl)
  } catch (error) {
    console.error('PayOS Error:', error)
    return { error: 'Không thể tạo link thanh toán' }
  }
}