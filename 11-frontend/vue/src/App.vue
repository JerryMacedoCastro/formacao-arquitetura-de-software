<script setup lang="ts">
  import { ref } from 'vue';

  let step = ref(1);
  let name = ref("");

  function next () {
    step.value++;
  }

  function getProgress () {
    let progress = 0;
    if (name.value) {
      progress += 25;
    }
    return progress;
  }
</script>

<template>
  <div>
    <div>
      <span class="span-step">{{ step }}</span>
      <span class="span-progress">{{ getProgress() }}%</span>
    </div>
    <div>
      <div>
        <input type="text" class="input-name" v-model="name" placeholder="Nome"/>
      </div>
    </div>
    <div>
      <button class="button-next" @click="next()">Próximo</button>
    </div>
  </div>
</template>

<style scoped>
</style>
