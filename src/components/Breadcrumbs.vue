<template>
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb mb-0">
      <li class="breadcrumb-item">
        <router-link to="/">Home</router-link>
      </li>
      <li
        v-for="(c, idx) in items"
        :key="c.id"
        :class="['breadcrumb-item', { active: idx === items.length - 1 }]"
        aria-current="page"
      >
        <template v-if="idx === items.length - 1">
          {{ c.name }}
        </template>
        <template v-else>
          <router-link :to="{ path: '/', query: { category: String(c.id), page: '1' } }">
            {{ c.name }}
          </router-link>
        </template>
      </li>
    </ol>
  </nav>
</template>

<script lang="ts" setup>
import type { Category } from '@/types/ecwid/category'

defineProps<{
  items: Category[]
}>()
</script>
