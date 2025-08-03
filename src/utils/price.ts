import type { Product } from '@/types/ecwid/product'

const DEFAULT_CURRENCY = 'EUR'

export function formatAmount(amount: number, currency?: string): string {
  const curr = currency || DEFAULT_CURRENCY
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: curr.length === 1 ? DEFAULT_CURRENCY : curr,
    }).format(amount)
  } catch {
    return `${curr} ${amount.toFixed(2)}`
  }
}

export function getDisplayPrice(product: Partial<Product>): string {
  if (product.defaultDisplayedPriceFormatted) {
    return product.defaultDisplayedPriceFormatted
  }
  return formatAmount(product.price ?? 0, product.currency)
}
