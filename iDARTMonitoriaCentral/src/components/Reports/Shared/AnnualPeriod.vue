<template>
  <div class="col q-mb-md" style="max-width: 300px">
    <SelectField
      :label="Ano"
      v-model="yearAnnualPeriod"
      :options="yearsToShow"
      outlined
      dense
      @change="updateYear"
    />
    <!--q-input
      class="col q-mr-md"
      dense
      outlined
      v-model="yearAnnualPeriod"
      type="number"
      label="Ano"
      @blur="updateYear"
    /-->
  </div>
</template>

<script setup>
/*
  Declarations
*/

import DashboardUtils from 'src/use/DashboardUtils';
import SelectField from 'src/components/Shared/Input/SelectField.vue';
import { inject, ref } from 'vue';

const params = inject('params');
const yearsToShow = DashboardUtils.getLastFiveYears();
const yearAnnualPeriod = ref(new Date().getFullYear());

const updateYear = () => {
  params.value.year = yearAnnualPeriod.value;
};
</script>
