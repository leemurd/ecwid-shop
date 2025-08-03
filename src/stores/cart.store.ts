import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CartItem } from '@/types/ecwid/cart'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  const totalCount = computed(
    () => items.value.reduce((sum, i) => sum + i.quantity, 0)
  )
  const totalPrice = computed(
    () => items.value.reduce((sum, i) => sum + i.price * i.quantity, 0)
  )

  const add = (item: Omit<CartItem, 'quantity'>) => {
    const existing = items.value.find(i => i.productId === item.productId)
    if (existing) existing.quantity += 1
    else items.value.push({ ...item, quantity: 1 })
  }

  const remove = (productId: number) => {
    items.value = items.value.filter(i => i.productId !== productId)
  }

  const clear = () => {
    items.value = []
  }

  return {
    items,
    totalCount,
    totalPrice,
    add,
    remove,
    clear,
  }
}, {
  persist: {
    key: 'ecwid-cart',
    storage: localStorage,
  },
})
