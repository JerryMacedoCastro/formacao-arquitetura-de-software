<script setup lang="ts">
    import type SignupForm from '@/entities/SignupForm';

    defineProps<{
        form: SignupForm
    }>();
</script>

<template>
    <span class="span-progress">{{ form.getProgress() }}%</span>
</template>