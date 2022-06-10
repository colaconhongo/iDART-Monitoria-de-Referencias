<template>
  <q-select
    dense
    v-model="props.value"
    :options="options"
    ref="props.value"
    :rules="rules"
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
  rules: {
    type: String,
  },
  options: {
    type: Array,
  },
});
</script>
