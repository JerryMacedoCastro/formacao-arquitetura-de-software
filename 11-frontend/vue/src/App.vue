<script setup lang="ts">
  import { ref } from 'vue';

  let step = ref(1);

  function next () {
    step.value++;
  }
</script>

<template>
  <div>
    <div>
      <span class="span-step">{{ step }}</span>
    </div>
    <div>
      <button class="button-next" @click="next()">Próximo</button>
    </div>
  </div>
</template>

<style scoped>
</style>
