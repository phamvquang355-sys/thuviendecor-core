import { create } from 'zustand'

interface CreditState {
  balance: number
  setBalance: (balance: number) => void
  deductCredit: (amount: number) => boolean
}

export const useCreditStore = create<CreditState>()((set, get) => ({
  balance: 0,
  setBalance: (balance) => set({ balance }),
  deductCredit: (amount) => {
    const currentBalance = get().balance
    if (currentBalance >= amount) {
      set({ balance: currentBalance - amount })
      return true
    }
    return false
  },
}))
