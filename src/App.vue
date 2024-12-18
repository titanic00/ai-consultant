<script lang="ts">
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  data() {
    return {
      components: [HelloWorld],
      mounted() {
        console.log("tews");
      }
    }
  }
}
</script>

<template>
  <!-- <RouterView />  -->
  <HelloWorld />
</template>

<style scoped></style>
