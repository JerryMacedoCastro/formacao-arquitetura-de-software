<script setup lang="ts">
    import type SignupForm from '@/entities/SignupForm';

    defineProps<{
        form: SignupForm
    }>();
</script>

<template>
    <span class="span-step">{{ form.step }}</span>
</template>