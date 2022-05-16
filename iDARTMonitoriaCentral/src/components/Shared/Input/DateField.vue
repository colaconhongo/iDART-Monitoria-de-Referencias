<template>
  <q-input dense outlined v-model:date="props.date" class="col">
    <template v-slot:append>
      <q-icon name="event" class="cursor-pointer" v-model:date="props.date">
        <q-popup-proxy
          ref="qDateProxy"
          transition-show="scale"
          transition-hide="scale"
        >
          <q-date
            v-model:modelValue="dprops.ate"
            v-model:date="props.date"
            @input="(event) => $emit('update:date', event.target.value)"
          >
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>
<script setup>
import { date } from 'quasar';

/*
  Props
*/
const props = defineProps({
  date: {
    type: date,
    default: new Date(),
  },
});

/*
  Emits

const emit = defineEmits(['updateDate'])

/*
  on input

  const onInput = (event) => {
  emit('update:date', $event.target.value)
}
*/
</script>
