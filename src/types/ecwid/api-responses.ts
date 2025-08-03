import type {Category} from "@/types/ecwid/category.ts";

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  offset?: number
  limit?: number
}

export type CategoriesResponse = PaginatedResponse<Category>
export type ProductsResponse = PaginatedResponse<any>
