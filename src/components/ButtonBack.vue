<template>
  <button @click="goBack" class="text-decoration-none btn btn-link p-0">
    <slot>&larr; Back</slot>
  </button>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
const goBack = () => router.back()
</script>
