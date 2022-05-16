<template>
  <q-input
    outlined
    class="col"
    ref="ref"
    dense
    v-model="props.numbers"
    type="number"
    @input="(event) => $emit('update:numbers', event.target.value)"
    lazy-rules
  />
</template>

<script setup>
/*
  Props
*/

const props = defineProps({
  numbers: {
    type: Number,
    default: 0,
  },
});
/*
  Emits

const emit = defineEmits(['update:numbers'])

  on input

const onInput = (event) => {
  emit('update:numbers', event.target.value)
}
*/
</script>

<style></style>
