'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createTopupTransaction(amount: number) {
  const supabase = await createClient()

  // 1. Kiểm tra xác thực người dùng
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Bạn cần đăng nhập để thực hiện giao dịch này.' }
  }

  // 2. Tạo mã Reference Code ngẫu nhiên (DULI_xxxxx)
  const randomNum = Math.floor(10000 + Math.random() * 90000)
  const referenceCode = `DULI_${randomNum}`

  // 3. Ghi nhận giao dịch vào Database
  const { error: txError } = await supabase.from('transactions').insert({
    profile_id: user.id,
    amount: amount,
    type: 'topup',
    status: 'pending',
    reference_code: referenceCode,
  })

  if (txError) {
    console.error('Topup Transaction Error:', txError)
    return { error: 'Đã xảy ra lỗi khi tạo giao dịch. Vui lòng thử lại.' }
  }

  // 4. Revalidate đường dẫn để cập nhật dữ liệu (nếu cần thiết)
  revalidatePath('/topup')
  revalidatePath('/')

  return { 
    success: true, 
    referenceCode: referenceCode,
    message: 'Đã tạo yêu cầu thành công!' 
  }
}
