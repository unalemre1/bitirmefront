<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
defineProps<{
  title: string
}>()
</script>

<template>
   <router-link 
    to="/info" 
    class="logo-link"
  >
  <a class="logo-link">
    <h1 class="logo-text">{{ title }}</h1>
  </a>
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