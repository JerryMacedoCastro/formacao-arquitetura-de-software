<script setup lang="ts">
  import { ref } from 'vue';

  let step = ref(1);
  let name = ref("");
  let email = ref("");
  let document = ref("");
  let password = ref("");
  let confirmPassword = ref("");

  function next () {
    step.value++;
  }

  function previous () {
    step.value--;
  }

  function getProgress () {
    let progress = 0;
    if (name.value) {
      progress += 25;
    }
    if (email.value) {
      progress += 25;
    }
    if (document.value) {
      progress += 25;
    }
    if (password.value && confirmPassword.value && password.value === confirmPassword.value) {
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
    <div v-if="step === 1">
      <div>
        <input type="text" class="input-name" v-model="name" placeholder="Nome"/>
      </div>
      <div>
        <input type="text" class="input-email" v-model="email" placeholder="Email"/>
      </div>
      <div>
        <input type="text" class="input-document" v-model="document" placeholder="Documento"/>
      </div>
    </div>
    <div v-if="step === 2">
      <div>
        <input type="text" class="input-password" v-model="password" placeholder="Senha"/>
      </div>
      <div>
        <input type="text" class="input-confirm-password" v-model="confirmPassword" placeholder="Confirmação da Senha"/>
      </div>
    </div>
    <div>
      <button v-if="step === 1" class="button-next" @click="next()">Próximo</button>
      <button v-if="step === 2" class="button-previous" @click="previous()">Anterior</button>
    </div>
  </div>
</template>

<style scoped>
</style>
