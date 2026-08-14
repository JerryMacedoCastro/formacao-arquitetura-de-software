<script setup lang="ts">
    import type SignupForm from '@/entities/SignupForm';

    defineProps<{
        form: SignupForm
    }>();
</script>

<template>
    <button v-if="form.step === 1" class="button-next" @click="form.next()">Continuar</button>
    <button v-if="form.step === 2" class="button-previous" @click="form.previous()">Voltar</button>
    <button v-if="form.step === 2" class="button-confirm" @click="form.confirm()">Confirmar</button>
</template>