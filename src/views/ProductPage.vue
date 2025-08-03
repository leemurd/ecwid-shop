<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div>
        <button-back/>
      </div>
    </div>

    <div
      v-if="loading"
      class="mb-3"
    >
      <loading-spinner/>
    </div>
    <div v-if="error" class="alert alert-danger">
      {{ error }} <button class="btn btn-sm btn-outline-secondary" @click="reload">Retry</button>
    </div>

    <div v-if="product" class="row">
      <div class="col-md-5">
        <img
          v-if="product.imageUrl"
          :src="product.imageUrl"
          class="img-fluid border"
          alt="product image"
        />
      </div>
      <div class="col-md-7">
        <h1>{{ product.name }}</h1>
        <div class="mb-2 fs-5">{{ displayPrice }}</div>
        <div v-if="product.description" v-html="product.description"></div>
        <button class="btn btn-primary" :disabled="adding" @click="buy">
          {{ adding ? 'Adding...' : 'Add to cart' }}
        </button>
        <div v-if="added" class="mt-2 text-success">Added to cart</div>
      </div>
    </div>

    <div v-if="!loading && !product && !error" class="text-muted">
      Product not found.
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useProductStore } from '@/stores/product.store'
import { useCartStore } from '@/stores/cart.store'
import { getDisplayPrice } from '@/utils/price'
import ButtonBack from "@/components/ButtonBack.vue";
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const route = useRoute()
const productStore = useProductStore()
const cartStore = useCartStore()

const productId = computed(() => Number(route.params.id))
const loading = computed(() => productStore.loading)
const error = computed(() => productStore.error)
const product = computed(() => productStore.byId[productId.value] ?? null)

const displayPrice = computed(() => {
  if (!product.value) return ''
  return getDisplayPrice(product.value)
})

const adding = ref(false)
const added = ref(false)

const buy = async () => {
  if (!product.value) return
  adding.value = true
  cartStore.add({
    productId: product.value.id,
    name: product.value.name,
    price: product.value.price,
    currency: product.value.currency,
  })
  added.value = true
  setTimeout(() => (added.value = false), 1000)
  adding.value = false
}

const reload = () => {
  productStore.fetchProductDetail(productId.value, true)
}

onMounted(() => {
  productStore.fetchProductDetail(productId.value)
})
</script>
