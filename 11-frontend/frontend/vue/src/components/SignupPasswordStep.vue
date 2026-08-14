<script setup lang="ts">
    import type SignupForm from '@/entities/SignupForm';

    defineProps<{
        form: SignupForm
    }>();
</script>

<template>
    <div>
        <input type="text" class="input-password" v-model="form.password" placeholder="Senha"/>
    </div>
    <div>
        <input type="text" class="input-confirm-password" v-model="form.confirmPassword" placeholder="Confirmação da Senha"/>
    </div>
</template>