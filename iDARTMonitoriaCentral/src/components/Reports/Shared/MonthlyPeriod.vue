<template>
  <div class="row q-mb-md">
    <q-select
      class="col q-mr-md"
      dense
      outlined
      :options="months"
      v-model="params.period"
      ref="periodMonth"
      option-value="id"
      option-label="description"
      :rules="[(val) => val != null || ' Por favor indique o Mês']"
      lazy-rules
      label="Mês"
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
            v-model="params.year"
            type="number"
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
const months = [
  { id: 1, description: 'Janeiro' },
  { id: 2, description: 'Fevereiro' },
  { id: 3, description: 'Março' },
  { id: 4, description: 'Abril' },
  { id: 5, description: 'Maio' },
  { id: 6, description: 'Junho' },
  { id: 7, description: 'Julho' },
  { id: 8, description: 'Agosto' },
  { id: 9, description: 'Setembro' },
  { id: 10, description: 'Outubro' },
  { id: 11, description: 'Novembro' },
  { id: 12, description: 'Dezembro' },
];

const params = inject('params');
</script>
