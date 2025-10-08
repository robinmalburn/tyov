<template>
  <span
    class="cursor-pointer select-none mx-1 hover:text-gray-400"
    title="Remove item"
    @click="$emit('remove')"
    v-html="'&times;'"
  />
</template>

<script setup>
const emit = defineEmits(["remove"]);
</script>
