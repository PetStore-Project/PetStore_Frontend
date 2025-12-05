<template>
  <div class="nav_display">
    <RouterView/>
  </div>
  
</template>

<script lang="ts">
  import Navigation from './components/navigation.vue'
  import ProductCard from './components/ProductCard.vue';
  export default {
    name: 'App',
    components: {
      Navigation,
      ProductCard
    }
  }
</script>

<style scoped>
  .nav_display {
    width: 100%;
  }
</style>