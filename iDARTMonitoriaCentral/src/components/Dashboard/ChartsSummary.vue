<template>
  <div class="q-pa-md row items-start q-gutter-md justify-center">
    <q-card class="my-card" flat bordered>
      <q-item>
        <q-item-section avatar icon="person">
          <q-icon name="people"></q-icon>
        </q-item-section>

        <q-item-section class="text-font">
          <q-item-label class="">Total de Pacientes Referidos</q-item-label>
        </q-item-section>
      </q-item>
      <q-card-section horizontal>
        <q-separator />
        <q-card-section class="col-4 text-bold">
          {{ total.totalNumbers }}
        </q-card-section>
      </q-card-section>
    </q-card>
    <q-card class="my-card" flat bordered>
      <q-item>
        <q-item-section avatar icon="person">
          <q-icon name="person"></q-icon>
        </q-item-section>

        <q-item-section class="text-font">
          <q-item-label>Total de Pacientes Que Voltaram para US</q-item-label>
        </q-item-section>
      </q-item>
      <q-card-section horizontal>
        <q-separator />

        <q-card-section class="col-4 text-bold">
          {{ total.totalBackNumbers }}
        </q-card-section>
      </q-card-section>
    </q-card>
    <q-card class="my-card" flat bordered>
      <q-item>
        <q-item-section class="text-font">
          <q-item-label>Total de Pacientes referidos por Género</q-item-label>
        </q-item-section>
      </q-item>
      <q-card-section horizontal>
        <q-item-section avatar>
          <q-icon name="woman"></q-icon>
        </q-item-section>

        <q-card-section class="col-4 text-bold">
          {{ total.totalFemaleNumbers }}
        </q-card-section>
        <q-item-section avatar>
          <q-icon name="man"></q-icon>
        </q-item-section>

        <q-card-section class="col-4 text-bold">
          {{ total.totalMaleNumbers }}
        </q-card-section>
      </q-card-section>
    </q-card>
  </div>
</template>
<script setup>
import { reactive, watch, inject } from 'vue';

const total = inject('total');

/*
  Computed
*/
</script>

<style lang="scss" scoped>
.background {
  background-color: $grey-2;
}
.my-card {
  border-radius: 20px;
  background-color: white;
}

.text-font {
  font-size: 13px;
  font-family: 'Arial', Sans-serif;
}

.text-bold {
  font-family: 'Monaco', Monospace;
  font-weight: bold;
}
</style>
