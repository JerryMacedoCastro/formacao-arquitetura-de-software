<script setup lang="ts">
    import type SignupForm from '@/entities/SignupForm';

    defineProps<{
        form: SignupForm
    }>();
</script>

<template>
    <span class="span-error">{{ form.error }}</span>
    <span class="span-success">{{ form.success }}</span>
</template>