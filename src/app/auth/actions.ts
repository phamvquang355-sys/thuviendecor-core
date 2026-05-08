'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

// Định nghĩa khung kiểm tra dữ liệu đầu vào
const authSchema = z.object({
  email: z.string().email('Email không đúng định dạng.'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự.'),
})

export async function login(formData: FormData) {
  const supabase = await createClient()

  // 1. Kiểm tra định dạng dữ liệu
  const validatedFields = authSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.email?.[0] ||
        validatedFields.error.flatten().fieldErrors.password?.[0]
    }
  }

  const { email, password } = validatedFields.data

  // 2. Thực hiện đăng nhập
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: 'Email hoặc mật khẩu không chính xác.' }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // 1. Kiểm tra định dạng dữ liệu
  const validatedFields = authSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.email?.[0] ||
        validatedFields.error.flatten().fieldErrors.password?.[0]
    }
  }

  const { email, password } = validatedFields.data

  // 2. Thực hiện đăng ký
  // Lưu ý: Profiles sẽ được tạo tự động bởi SQL Trigger chúng ta đã cài trên Supabase
  const { error } = await supabase.auth.signUp({ email, password })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function logout() {
  const supabase = await createClient()

  await supabase.auth.signOut()

  revalidatePath('/', 'layout')
  // Chuyển hướng về trang chủ sau khi đăng xuất để tránh lỗi treo session
  redirect('/')
}