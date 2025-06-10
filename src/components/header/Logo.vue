<script setup lang="ts">
// We don't need useRouter if we're not using the router object directly in <script setup>
// import { useRouter } from 'vue-router'

// const router = useRouter() // This line is no longer needed
defineProps<{
  title: string
}>()
</script>

<template>
  <router-link
    to="/info"
    class="logo-link"
  >
    <h1 class="logo-text">{{ title }}</h1>
  </router-link>
</template>

<style scoped>
.logo-link {
  text-decoration: none;
  color: inherit;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}
</style>