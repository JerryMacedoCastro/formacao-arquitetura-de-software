<script setup lang="ts">
  import { inject, ref } from 'vue';
  import type AccountGateway from './gateways/AccountGateway';
  import SignupForm from './entities/SignupForm';

  const accountGateway = inject("accountGateway") as AccountGateway;
  const formSignup = new SignupForm();
  const form = ref(formSignup);

  formSignup.register("formConfirmed", async (event: any) => {
    const outputSignup = await accountGateway.signup(event);
    if (outputSignup.accountId) {
      form.value.success = "Conta criada com sucesso";
    } else {
      form.value.error = "Falha ao tentar criar a conta";
    }
  });

</script>

<template>
  <div>
    <div>
      <span class="span-step">{{ form.step }}</span>
      <br/>
      <span class="span-progress">{{ form.getProgress() }}%</span>
    </div>
    <div v-if="form.step === 1">
      <div>
        <input type="text" class="input-name" v-model="form.name" placeholder="Nome"/>
      </div>
      <div>
        <input type="text" class="input-email" v-model="form.email" placeholder="Email"/>
      </div>
      <div>
        <input type="text" class="input-document" v-model="form.document" placeholder="Documento"/>
      </div>
    </div>
    <div v-if="form.step === 2">
      <div>
        <input type="text" class="input-password" v-model="form.password" placeholder="Senha"/>
      </div>
      <div>
        <input type="text" class="input-confirm-password" v-model="form.confirmPassword" placeholder="Confirmação da Senha"/>
      </div>
    </div>
    <div>
      <button v-if="form.step === 1" class="button-next" @click="form.next()">Continuar</button>
      <button v-if="form.step === 2" class="button-previous" @click="form.previous()">Voltar</button>
      <button v-if="form.step === 2" class="button-confirm" @click="form.confirm()">Confirmar</button>
      <span class="span-error">{{ form.error }}</span>
      <span class="span-success">{{ form.success }}</span>
    </div>
  </div>
</template>

<style scoped>
</style>
