<script setup lang="ts">
  import { ref } from 'vue';

  let step = ref(1);
  let name = ref("");
  let email = ref("");
  let document = ref("");
  let password = ref("");
  let confirmPassword = ref("");
  let error = ref("");

  function next () {
    error.value = "";
    if (!name.value) {
      error.value = "Preencha o nome";
      return;
    }
    if (!email.value) {
      error.value = "Preencha o email";
      return;
    }
    if (!document.value) {
      error.value = "Preencha o documento";
      return;
    }
    step.value++;
  }

  function previous () {
    step.value--;
  }

  function confirm () {
    error.value = "";
    if (!password.value) {
      error.value = "Preencha a senha";
      return;
    }
    if (!confirmPassword.value) {
      error.value = "Preencha a confirmação da senha";
      return;
    }
    if (password.value !== confirmPassword.value) {
      error.value = "A senha e a confirmação da senha devem ser iguais";
      return;
    }
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
      <button v-if="step === 1" class="button-next" @click="next()">Continuar</button>
      <button v-if="step === 2" class="button-previous" @click="previous()">Voltar</button>
      <button v-if="step === 2" class="button-confirm" @click="confirm()">Confirmar</button>
      <span class="span-error">{{ error }}</span>
    </div>
  </div>
</template>

<style scoped>
</style>
