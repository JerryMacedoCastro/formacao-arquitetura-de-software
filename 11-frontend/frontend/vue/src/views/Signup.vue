<script setup lang="ts">
  import { inject, ref } from 'vue';
  import type AccountGateway from '../gateways/AccountGateway';
  import SignupForm from '../entities/SignupForm';
  import SignupStep from '@/components/SignupStep.vue';
  import SignupProgress from '@/components/SignupProgress.vue';
  import SignupPersonalDataStep from '@/components/SignupPersonalDataStep.vue';
  import SignupPasswordStep from '@/components/SignupPasswordStep.vue';
  import SignupActions from '@/components/SignupActions.vue';
  import SignupMessages from '@/components/SignupMessages.vue';

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
      <SignupStep :form="form"></SignupStep>
      <br/>
      <SignupProgress :form="form"></SignupProgress>
    </div>
    <div v-if="form.step === 1">
      <SignupPersonalDataStep :form="form"></SignupPersonalDataStep>
    </div>
    <div v-if="form.step === 2">
      <SignupPasswordStep :form="form"></SignupPasswordStep>
    </div>
    <div>
      <SignupActions :form="form"></SignupActions>
      <SignupMessages :form="form"></SignupMessages>
    </div>
  </div>
</template>

<style scoped>
</style>
