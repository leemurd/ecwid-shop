import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { api } from '@/lib/api'
import type { Product } from '@/types/ecwid/product'
import { adaptProduct } from '@/mappers/ecwid'

const TTL = 5 * 60_000
const DEFAULT_PER_PAGE = 12

type CategoryPageKey = string // `category:${categoryId}:page:${page}:perPage:${perPage}`
type AllPageKey = string // `all:page:${page}:perPage:${perPage}`

export const useProductStore = defineStore('product', () => {
  const byId = reactive<Record<number, Product>>({})
  const listByCategoryPage = reactive<Record<CategoryPageKey, Product[]>>({})
  const listAllPages = reactive<Record<AllPageKey, Product[]>>({})
  const lastFetched = reactive<Record<string, number>>({})
  const loading = ref(false)
  const error = ref<string | null>(null)
  const totalByCategory = reactive<Record<number, number>>({})
  const totalAll = ref(0)

  const fetchCategoryProducts = async (
    categoryId: number,
    page = 1,
    perPage = DEFAULT_PER_PAGE,
    force = false
  ) => {
    const offset = (page - 1) * perPage
    const cacheKey = `category:${categoryId}:page:${page}:perPage:${perPage}`
    const now = Date.now()
    if (!force && listByCategoryPage[cacheKey] && now - (lastFetched[cacheKey] || 0) < TTL) {
      return
    }
    loading.value = true
    error.value = null
    try {
      const res = await api.get('/products', {
        params: {
          category: categoryId,
          offset,
          limit: perPage,
        },
      })
      const items: Product[] = (res.data.items || []).map(adaptProduct)
      listByCategoryPage[cacheKey] = items
      items.forEach(p => {
        byId[p.id] = p
      })
      lastFetched[cacheKey] = now
      if (typeof res.data.total === 'number') {
        totalByCategory[categoryId] = res.data.total
      }
    } catch (e: any) {
      error.value = e.message || 'Failed to load products'
    } finally {
      loading.value = false
    }
  }

  const fetchAllProducts = async (page = 1, perPage = DEFAULT_PER_PAGE, force = false) => {
    const offset = (page - 1) * perPage
    const cacheKey = `all:page:${page}:perPage:${perPage}`
    const now = Date.now()
    if (!force && listAllPages[cacheKey] && now - (lastFetched[cacheKey] || 0) < TTL) {
      return
    }
    loading.value = true
    error.value = null
    try {
      const res = await api.get('/products', {
        params: {
          offset,
          limit: perPage,
        },
      })
      const items: Product[] = (res.data.items || []).map(adaptProduct)
      listAllPages[cacheKey] = items
      items.forEach(p => {
        byId[p.id] = p
      })
      lastFetched[cacheKey] = now
      if (typeof res.data.total === 'number') {
        totalAll.value = res.data.total
      }
    } catch (e: any) {
      error.value = e.message || 'Failed to load products'
    } finally {
      loading.value = false
    }
  }

  const fetchProductDetail = async (productId: number, force = false) => {
    const cacheKey = `product:${productId}`
    const now = Date.now()
    if (!force && byId[productId] && now - (lastFetched[cacheKey] || 0) < TTL) {
      return
    }
    loading.value = true
    error.value = null
    try {
      const res = await api.get(`/products/${productId}`)
      const product = adaptProduct(res.data)
      byId[productId] = product
      lastFetched[cacheKey] = now
    } catch (e: any) {
      error.value = e.message || 'Failed to load product'
    } finally {
      loading.value = false
    }
  }

  const getProductsForCategory = (categoryId: number, page = 1, perPage = DEFAULT_PER_PAGE) => {
    const cacheKey = `category:${categoryId}:page:${page}:perPage:${perPage}`
    return listByCategoryPage[cacheKey] || []
  }

  const getTotalForCategory = (categoryId: number) => {
    return totalByCategory[categoryId] ?? 0
  }

  const getAllProducts = (page = 1, perPage = DEFAULT_PER_PAGE) => {
    const cacheKey = `all:page:${page}:perPage:${perPage}`
    return listAllPages[cacheKey] || []
  }

  return {
    byId,
    listByCategoryPage,
    listAllPages,
    lastFetched,
    loading,
    error,
    totalByCategory,
    totalAll,
    fetchCategoryProducts,
    fetchAllProducts,
    fetchProductDetail,
    getProductsForCategory,
    getTotalForCategory,
    getAllProducts,
  }
})
