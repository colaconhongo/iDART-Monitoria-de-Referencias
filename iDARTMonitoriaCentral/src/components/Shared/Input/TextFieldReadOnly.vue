<template>
  <q-input
    outlined
    ref="ref"
    v-model="props.value"
    type="text"
    @input="(event) => $emit('update:value', event.target.value)"
    lazy-rules
    readonly
  />
</template>

<script setup>
/*
  Props
*/
const props = defineProps({
  value: {
    type: String,
    default: '',
  },
});
</script>

<style></style>
