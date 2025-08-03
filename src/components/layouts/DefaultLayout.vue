<template>
  <div>
    <nav class="navbar bg-body-tertiary border-bottom border-body">
      <div class="container">
        <router-link
          to="/"
          class="navbar-brand"
        >Ecwid shop</router-link>

        <div class=""><CartIcon /></div>
      </div>
    </nav>
    <main>
      <slot />
    </main>
  </div>
</template>

<script lang="ts" setup>
import CartIcon from '@/components/CartIcon.vue'
</script>
