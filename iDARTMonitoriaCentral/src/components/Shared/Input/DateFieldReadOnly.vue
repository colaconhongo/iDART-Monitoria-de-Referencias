<!--
<template>
  <q-input dense outlined v-model="props.date" class="col">
    <template v-slot:append>
      <q-icon name="event" class="cursor-pointer" v-model:date="props.date">
        <q-popup-proxy
          ref="qDateProxy"
          transition-show="scale"
          transition-hide="scale"
        >
          <q-date
            v-model="props.date"
            @input="(event) => $emit('update:date', event.target.value)"
          >
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>
-->

<template>
  <q-input id="date-edit-episode" outlined :value="date" class="col" readonly>
    <template v-slot:append>
      <q-icon name="event" class="cursor-pointer" :value="props.date">
        <q-popup-proxy
          ref="qDateProxy"
          transition-show="scale"
          transition-hide="scale"
        >
          <q-date
            :modelValue="date"
            :value="date"
            @input="(event) => $emit('update:date', $event.target.value)"
            disable
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
    type: Date,
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
