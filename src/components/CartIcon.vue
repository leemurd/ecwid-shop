<template>
  <div class="position-relative">
    <router-link
      to="/cart"
      class="btn btn-outline-secondary"
    >
      <i class="bi bi-bag"></i>
      <span v-if="count" class="badge bg-danger ms-3">{{ count }}</span>
    </router-link>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart.store'

const cart = useCartStore()
const count = computed(() => cart.totalCount)
</script>
