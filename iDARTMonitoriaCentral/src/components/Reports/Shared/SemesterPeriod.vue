<template>
  <div class="row q-mb-md">
    <q-select
      class="col q-mr-md"
      dense
      outlined
      transition-show="flip-up"
      transition-hide="flip-down"
      :options="semesters"
      v-model="params.period"
      ref="semesterPeriod"
      option-value="id"
      option-label="description"
      :rules="[(val) => val != null || ' Por favor indique o Semestre']"
      lazy-rules
      label="Semestre"
    />
    <SelectField
      :label="Ano"
      v-model="params.year"
      :options="yearsToShow"
      class="col q-mr-md"
      outlined
      dense
    />
    <!--q-input
          class="col q-mr-md"
          dense
          outlined
          type="number"
          v-model="params.year"
        /-->
  </div>
</template>

<script setup>
/*
  Imports
  */
import { inject } from 'vue';
import DashboardUtils from 'src/use/DashboardUtils';
import SelectField from 'src/components/Shared/Input/SelectField.vue';
/*
  Declaration
  */
const yearsToShow = DashboardUtils.getLastFiveYears();
const semesters = [
  { id: 1, description: 'Semestre 1' },
  { id: 2, description: 'Semestre 2' },
];

const params = inject('params');
</script>
