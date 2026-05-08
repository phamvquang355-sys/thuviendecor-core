'use server'

import { supabaseAdmin } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { APP_ROUTES } from '@/lib/constants/routes'

// Dữ liệu trả về từ View admin_user_view
export type AdminUser = {
  id: string
  email: string
  credits: number
  role: 'USER' | 'ADMIN' | 'EDITOR'
  created_at: string
}

export async function fetchAllUsers() {
  const { data, error } = await supabaseAdmin
    .from('admin_user_view')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching users:', error)
    return []
  }
  
  return data as AdminUser[]
}

export async function manualCreditUpdate(userId: string, creditDelta: number) {
  if (!creditDelta || Number.isNaN(creditDelta)) return { error: 'Giá trị Credit không hợp lệ' }

  const { error } = await supabaseAdmin.rpc('increment_credits', {
    user_id: userId,
    amount: creditDelta
  })

  if (error) {
    console.error('Error updating credits:', error)
    return { error: 'Không thể cập nhật Credit' }
  }

  revalidatePath(`${APP_ROUTES.admin}/users`)
  return { success: true }
}

export async function updateUserCredits(userId: string, additionalCredits: number) {
  if (!additionalCredits || additionalCredits <= 0) return { error: 'Số Credit không hợp lệ' }
  return manualCreditUpdate(userId, additionalCredits)
}

export async function updateUserRole(userId: string, newRole: 'USER' | 'ADMIN' | 'EDITOR') {
  const { error } = await supabaseAdmin
    .from('profiles')
    .update({ role: newRole })
    .eq('id', userId)

  if (error) {
    console.error('Error updating role:', error)
    return { error: 'Không thể đổi Role' }
  }

  revalidatePath(`${APP_ROUTES.admin}/users`)
  return { success: true }
}
