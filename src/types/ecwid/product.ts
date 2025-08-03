export interface Product {
  id: number
  name: string
  description?: string
  shortDescription?: string
  price: number
  currency?: string
  imageUrl?: string
  thumbnailUrl?: string
  defaultDisplayedPriceFormatted?: string
}
