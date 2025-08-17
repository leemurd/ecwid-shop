<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div class="d-flex flex-column">
        <div class="mb-1">
          <h1 class="mb-0">Catalog</h1>
        </div>
        <Breadcrumbs :items="breadcrumbs" />
      </div>
    </div>

    <div class="row mb-4">
      <template v-if="categoryId === null">
        <div
          v-for="cat in rootCategories"
          :key="cat.id"
          class="col-auto"
        >
          <div
            class="card h-100 cursor-pointer"
            @click="selectCategory(cat.id)"
          >
            <img
              v-if="cat.imageUrl"
              :src="cat.imageUrl"
              class="card-img-top"
              alt=""
            />
            <div class="card-body position-relative">
              <h6 class="card-title mb-0">{{ cat.name }}</h6>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div
          v-if="rootOrCurrentChildren.length"
          class="w-100 mb-2"
        >
          <div class="h5 mb-1">Subcategories</div>
        </div>
        <div
          v-for="sub in rootOrCurrentChildren"
          :key="sub.id"
          class="col-md-4 mb-3"
        >
          <div
            class="card h-100 cursor-pointer"
            @click="selectCategory(sub.id)"
          >
            <img
              v-if="sub.imageUrl"
              :src="sub.imageUrl"
              class="card-img-top"
              alt=""
            />
            <div class="card-body position-relative">
              <h6 class="card-title mb-0">{{ sub.name }}</h6>
            </div>
          </div>
        </div>
      </template>
    </div>

    <div class="d-flex justify-content-between mb-2">
      <div class="d-flex gap-2 align-items-center">
        <div v-if="currentCategory">
          <div class="h5 mb-0">{{ currentCategory.name }}</div>
        </div>
        <div v-else>
          <div class="h5 mb-0">All products</div>
        </div>
      </div>
      <div class="d-flex gap-2 align-items-center">
        <div class="small text-muted">
          Page {{ page }} / {{ totalPages }}
        </div>

        <button
          class="btn btn-sm btn-outline-secondary"
          @click="refresh"
        >
          Refresh
        </button>
      </div>
    </div>

    <div
      v-if="loading"
      class="text-center mb-3"
    >
      <loading-spinner/>
    </div>

    <div
      v-if="error"
      class="alert alert-danger mb-3"
    >
      {{ error }}
      <button
        class="btn btn-sm btn-outline-secondary"
        @click="refresh"
      >Retry</button>
    </div>

    <div class="row">
      <div
        v-for="p in products"
        :key="p.id"
        class="col-md-3 mb-3"
      >
        <div class="card h-100">
          <img
            v-if="p.imageUrl"
            :src="p.imageUrl"
            class="card-img-top"
            alt=""
          />
          <div class="card-body d-flex flex-column">
            <h6 class="card-title">{{ p.name }}</h6>
            <p class="mb-2 small">{{ getDisplayPrice(p) }}</p>
            <router-link
              :to="`/product/${p.id}`"
              class="mt-auto btn btn-sm btn-primary"
            >
              View
            </router-link>
          </div>
        </div>
      </div>
      <div
        v-if="!loading && !products.length"
        class="col-12"
      >
        <div class="text-muted">No products</div>
      </div>
    </div>

    <div
      v-if="total > perPage"
      class="d-flex justify-content-center align-items-center gap-2 mt-4"
    >
      <button
        class="btn btn-sm btn-outline-secondary"
        :disabled="isFirst" @click="goToPage(page - 1)"
      >
        Prev
      </button>
      <div>«{{ page }} / {{ totalPages }}»</div>
      <button
        class="btn btn-sm btn-outline-secondary"
        :disabled="isLast"
        @click="goToPage(page + 1)"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import { useCategoryStore } from '@/stores/category.store'
import { useProductStore } from '@/stores/product.store'
import { getDisplayPrice } from '@/utils/price'
import type { Category } from '@/types/ecwid/category'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const route = useRoute()
const router = useRouter()
const categoryStore = useCategoryStore()
const productStore = useProductStore()

const categoryId = computed<number | null>(() => {
  const v = Number(route.query.category)
  return Number.isNaN(v) ? null : v
})

const page = computed(() => {
  const p = Number(route.query.page)
  return Number.isNaN(p) || p < 1 ? 1 : p
})

const perPage = 8

const currentCategory = computed(() => {
  if (categoryId.value === null) return null
  return categoryStore.byId[categoryId.value] || null
})

const breadcrumbs = ref<Category[]>([])

const rootOrCurrentChildren = computed(() => {
  if (categoryId.value === null) return categoryStore.children[0] || []
  return categoryStore.children[categoryId.value] || []
})

const rootCategories = computed(() => categoryStore.children[0] || [])

const products = computed(() => {
  if (categoryId.value !== null) {
    return productStore.getProductsForCategory(categoryId.value, page.value, perPage)
  }
  return productStore.getAllProducts(page.value, perPage)
})

const total = computed(() => {
  if (categoryId.value !== null) return productStore.getTotalForCategory(categoryId.value)
  return productStore.totalAll
})

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / perPage)))
const isFirst = computed(() => page.value <= 1)
const isLast = computed(() => page.value >= totalPages.value)

const loading = computed(() => productStore.loading || categoryStore.loading)
const error = computed(() => productStore.error || categoryStore.error)

const refresh = () => {
  if (categoryId.value !== null) {
    categoryStore.fetchChildren(categoryId.value, true)
    productStore.fetchCategoryProducts(categoryId.value, page.value, perPage, true)
    categoryStore.buildBreadcrumbs(categoryId.value).then(path => {
      breadcrumbs.value = path || []
    })
  } else {
    categoryStore.fetchChildren(null, true)
    productStore.fetchAllProducts(page.value, perPage, true)
    breadcrumbs.value = []
  }
}

const goToPage = (p: number) => {
  const newPage = Math.max(1, p)
  const query: Record<string, string> = { page: String(newPage) }
  if (categoryId.value !== null) query.category = String(categoryId.value)
  router.replace({ path: '/', query })
}

const selectCategory = (id: number) => {
  router.replace({ path: '/', query: { category: String(id), page: '1' } })
}

const load = async () => {
  if (categoryId.value !== null) {
    await categoryStore.fetchChildren(categoryId.value)
    const path = await categoryStore.buildBreadcrumbs(categoryId.value)
    breadcrumbs.value = path || []
    await productStore.fetchCategoryProducts(categoryId.value, page.value, perPage)
  } else {
    await categoryStore.fetchChildren(null)
    breadcrumbs.value = []
    await productStore.fetchAllProducts(page.value, perPage)
  }
}

watch([categoryId, page], load, { immediate: true })
</script>
