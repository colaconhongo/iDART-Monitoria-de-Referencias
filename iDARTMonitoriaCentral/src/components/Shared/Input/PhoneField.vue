<template>
  <q-input
    outlined
    class="col"
    ref="ref"
    dense
    v-model="props.phone"
    type="tel"
    @input="(event) => $emit('update:phone', event.target.value)"
    lazy-rules
  >
    <template v-slot:prepend>
      <q-icon name="phone_android" />
    </template>
  </q-input>
</template>

<script setup>
const props = defineProps({
  phone: {
    type: String,
    default: '',
  },
});
</script>

<style></style>
