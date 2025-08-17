import type { Category } from '@/types/ecwid/category'
import type { Product } from '@/types/ecwid/product'

export function adaptCategory(src: any): Category {
  return {
    id: src.id,
    name: src.name,
    description: src.description ?? '',
    imageUrl: src.image?.url ?? src.imageUrl ?? undefined,
    thumbnailUrl: src.thumbnailUrl ?? undefined,
    parentId: typeof src.parentId === 'number' ? src.parentId : 0,
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
