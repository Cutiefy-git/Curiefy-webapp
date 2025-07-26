import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, CartStore } from '@/types'

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem: Omit<CartItem, 'quantity'>) => {
        const currentItems = get().items
        const existingItem = currentItems.find(item => item.itemId === newItem.itemId)

        if (existingItem) {
          // If item exists, increase quantity
          set({
            items: currentItems.map(item =>
              item.itemId === newItem.itemId
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          })
        } else {
          // If new item, add with quantity 1
          set({
            items: [...currentItems, { ...newItem, quantity: 1 }]
          })
        }
      },

      removeItem: (itemId: string) => {
        set({
          items: get().items.filter(item => item.itemId !== itemId)
        })
      },

      updateQuantity: (itemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(itemId)
          return
        }

        set({
          items: get().items.map(item =>
            item.itemId === itemId
              ? { ...item, quantity }
              : item
          )
        })
      },

      clearCart: () => {
        set({ items: [] })
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0)
      },
    }),
    {
      name: 'cutiefy-cart', // Key in localStorage
    }
  )
)