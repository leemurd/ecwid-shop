import type { Category } from '@/types/ecwid/category'
import type { Product } from '@/types/ecwid/product'
import type { CartItem } from '@/types/ecwid/cart'

export function adaptCategory(raw: any): Category {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description,
    imageUrl: raw.imageUrl || raw.thumbnailUrl || undefined,
    thumbnailUrl: raw.thumbnailUrl || raw.imageUrl || undefined,
    parent: raw.parent ?? null,
  }
}

export function adaptProduct(raw: any): Product {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description,
    shortDescription: raw.shortDescription,
    price: typeof raw.price === 'number' ? raw.price : (raw.price?.value ?? 0),
    currency: undefined,
    imageUrl: raw.imageUrl || raw.thumbnailUrl || undefined,
    thumbnailUrl: raw.thumbnailUrl || raw.imageUrl || undefined,
    defaultDisplayedPriceFormatted: raw.defaultDisplayedPriceFormatted,
  }
}
