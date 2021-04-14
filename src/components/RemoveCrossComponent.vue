<template>
    <span 
        class="cursor-pointer select-none mx-1"
        title="Remove item"
        @click="$emit('remove')"
        v-html="'&times;'"
    />
</template>

<script>
export default {
  name: 'RemoveCrossComponent',
}
</script>