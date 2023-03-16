<template>
  <div class="q-mt-lg">
    <div class="text-center">
      <div class="q-mt-md text-subtitle1 14">Procurar Pacientes</div>
      <div class="row">
        <q-space />
        <q-select
          class="col-2 q-my-md"
          dense
          outlined
          option-label="description"
          v-model="selectedModel"
          :options="dispenseModels"
          label="Tipo de Modelo de Dispensa"
        />
      </div>
      <q-separator color="grey-13" size="1px" />
    </div>
    <div class="q-mx-xl">
      <div class="row items-center q-my-md">
        <q-icon name="person_outline" size="sm" />
        <span class="q-pl-sm text-subtitle2">Informação inicial</span>
      </div>
      <div class="row">
        <q-input
          outlined
          label="Nr. Identificador"
          dense
          ref="identifier"
          class="col"
          lazy-rules
          :rules="[]"
          v-model="currPatient.patientid"
        />
        <textField
          dense
          class="col q-ml-md"
          label="Nome"
          :rules="[]"
          v-model="currPatient.firstnames"
        />
        <textField
          dense
          class="col q-ml-md"
          label="Apelido"
          :rules="[]"
          v-model="currPatient.lastname"
        />
      </div>
      <div class="q-mt-lg q-mb-md">
        <div class="row items-center q-mb-md">
          <q-icon name="search" size="sm" />
          <span class="q-pl-sm text-subtitle2">Resultado da Pesquisa</span>
        </div>
        <q-separator color="grey-13" size="1px" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue';
import textField from 'src/components/Shared/Input/TextField.vue';

const selectedModel = inject('selectedModel');
const dispenseModels = inject('dispenseModels');
const currPatient = inject('currPatient');
</script>
<style></style>
