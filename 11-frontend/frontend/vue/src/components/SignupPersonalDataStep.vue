<script setup lang="ts">
    import type SignupForm from '@/entities/SignupForm';

    defineProps<{
        form: SignupForm
    }>();
</script>

<template>
    <div>
        <input type="text" class="input-name" v-model="form.name" placeholder="Nome"/>
    </div>
    <div>
        <input type="text" class="input-email" v-model="form.email" placeholder="Email"/>
    </div>
    <div>
        <input type="text" class="input-document" v-model="form.document" placeholder="Documento"/>
    </div>
</template>
