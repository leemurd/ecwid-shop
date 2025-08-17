export interface Category {
  id: number
  name: string
  description?: string
  imageUrl?: string
  thumbnailUrl?: string
  parentId: number | null
}
