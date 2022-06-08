<template>

     <div class="row q-mb-md">
        <q-select
          class="col q-mr-md"
          dense outlined
          transition-show="flip-up"
          transition-hide="flip-down"
          :options="quarters"
          v-model="params.period"
          ref="quarterlyPeriod"
          option-value="id"
          option-label="description"
          :rules="[ val => ( val != null) || ' Por favor indique o Trimestre']"
          lazy-rules
          label="Trimestre"
        />

        <q-input
          class="col q-mr-md"
          dense
          outlined
          type="number"
          :rules="[ val => ( val != null) || ' Por favor indique o ano']"
          v-model="params.year"
        />
      </div>
  </template>

<script setup>
  /*
  Imports
  */
 import { inject } from 'vue';
  /*
  Declaration
  */
 const quarters = [
                    { id: 1, description: 'Trimestre 1' },
                    { id: 2, description: 'Trimestre 2' },
                    { id: 3, description: 'Trimestre 3' },
                    { id: 4, description: 'Trimestre 4' }
                  ]

const params = inject('params');
</script>
