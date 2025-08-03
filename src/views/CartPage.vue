<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div>
        <button-back>&larr; Continue shopping</button-back>
      </div>
      <div class="fs-5">Cart ({{ cart.totalCount }})</div>
    </div>

    <div v-if="!cart.items.length" class="alert alert-secondary">
      Cart is empty.
    </div>

    <div v-else>
      <div class="list-group mb-3">
        <div
          class="list-group-item d-flex align-items-center"
          v-for="item in cart.items"
          :key="item.productId"
        >
          <div class="flex-grow-1">
            <div class="fw-semibold">{{ item.name }}</div>
            <div class="small">
              {{ formatAmount(item.price, item.currency) }} × {{ item.quantity }} =
              <span>{{ formatAmount(item.price * item.quantity, item.currency) }}</span>
            </div>
          </div>
          <div>
            <button
              class="btn btn-sm btn-outline-danger"
              @click="remove(item.productId)"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <div class="d-flex justify-content-between align-items-center mb-4">
        <div class="fs-5">Total:</div>
        <div class="fs-5 fw-bold">{{ formatAmount(cart.totalPrice, defaultCurrency) }}</div>
      </div>

      <div v-if="ordered" class="alert alert-success">
        Congratulations on your purchase!
      </div>

      <div v-else>
        <button class="btn btn-success" @click="placeOrder">Place order</button>
        <button class="btn btn-outline-secondary ms-2" @click="clearCart">Clear cart</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useCartStore } from '@/stores/cart.store'
import { formatAmount } from '@/utils/price'
import ButtonBack from "@/components/ButtonBack.vue";

const cart = useCartStore()
const defaultCurrency = 'USD'
const ordered = ref(false)

const remove = (id: number) => {
  cart.remove(id)
}

const clearCart = () => {
  cart.clear()
}

const placeOrder = () => {
  ordered.value = true
}
</script>
