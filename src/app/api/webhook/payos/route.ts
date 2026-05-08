import { NextResponse } from 'next/server'
import { type Webhook } from '@payos/node'
import { payOSClient } from '@/lib/payos/client'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // 1. Xác thực chữ ký webhook từ PayOS
    const webhookPayload = body as Webhook
    if (!webhookPayload.success) {
      return NextResponse.json({ received: true })
    }

    const webhookData = await payOSClient.webhooks.verify(webhookPayload)
    if (!webhookData) {
      return NextResponse.json({ received: true })
    }

    const orderCode = String(webhookData.orderCode)

    // 2. Chỉ xử lý giao dịch đang pending để tránh cộng credit lặp
    const { data: transaction, error: transactionError } = await supabaseAdmin
      .from('transactions')
      .select('id, profile_id, amount, status')
      .eq('reference_code', orderCode)
      .single()

    if (transactionError || !transaction || transaction.status !== 'pending') {
      return NextResponse.json({ received: true })
    }

    // 3. Cập nhật trạng thái giao dịch completed
    const { error: updateError } = await supabaseAdmin
      .from('transactions')
      .update({ status: 'completed' })
      .eq('id', transaction.id)
      .eq('status', 'pending')

    if (updateError) {
      console.error('Failed to update transaction status:', updateError)
      return NextResponse.json({ received: false }, { status: 500 })
    }

    // 4. Cộng credit bằng RPC increment_credits
    const creditAmount = Math.floor(transaction.amount / 100)
    const { error: rpcError } = await supabaseAdmin.rpc('increment_credits', {
      user_id: transaction.profile_id,
      amount: creditAmount,
    })

    if (rpcError) {
      console.error('Failed to increment credits:', rpcError)
      return NextResponse.json({ received: false }, { status: 500 })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('PayOS webhook error:', error)
    return NextResponse.json({ received: false }, { status: 400 })
  }
}