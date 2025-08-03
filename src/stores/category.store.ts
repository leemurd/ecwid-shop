import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { api } from '@/lib/api'
import type { Category } from '@/types/ecwid/category'
import { adaptCategory } from '@/mappers/ecwid'

const TTL = 5 * 60_000

export const useCategoryStore = defineStore('category', () => {
  const byId = reactive<Record<number, Category>>({})
  const children = reactive<Record<number, Category[]>>({})
  const lastFetched = reactive<Record<string, number>>({})
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchChildren = async (parentId: number | null = null, force = false) => {
    const cacheKey = `children:${parentId ?? 'root'}`
    const now = Date.now()
    const key = parentId === null ? 0 : parentId
    if (!force && children[key] && now - (lastFetched[cacheKey] || 0) < TTL) {
      return
    }

    try {
      loading.value = true
      error.value = null
      const params: any = {}
      if (parentId !== null) params.parent = parentId
      const res = await api.get('/categories', { params })
      const items: Category[] = (res.data.items || []).map(adaptCategory)
      children[key] = items
      items.forEach(c => {
        byId[c.id] = c
      })
      lastFetched[cacheKey] = now
    } catch (e: any) {
      error.value = e.message || 'Failed to load categories'
    } finally {
      loading.value = false
    }
  }

  const buildBreadcrumbs = async (targetId: number): Promise<Category[] | null> => {
    await fetchChildren(null)
    let best: Category[] | null = null

    const dfs = async (currentId: number | null, path: Category[], seen: Set<string>) => {
      const key = currentId === null ? 0 : currentId
      await fetchChildren(currentId)
      const list = children[key] || []
      for (const cat of list) {
        const newPath = [...path, cat]
        const signature = [...newPath.map(c => c.id)].join('>')
        if (seen.has(signature)) continue
        seen.add(signature)

        if (cat.id === targetId) {
          if (!best || newPath.length > best.length) {
            best = newPath
          }
        }
        await dfs(cat.id, newPath, seen)
      }
    }

    await dfs(null, [], new Set())
    return best
  }

  return {
    byId,
    children,
    lastFetched,
    loading,
    error,
    fetchChildren,
    buildBreadcrumbs,
  }
})
