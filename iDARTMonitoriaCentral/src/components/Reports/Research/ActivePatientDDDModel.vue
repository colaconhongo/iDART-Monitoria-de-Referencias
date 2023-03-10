<template>
  <div ref="filterDrugStoreSection">
    <Bar
      :addVisible="false"
      :mainContainer="true"
      :closeVisible="true"
      @closeSection="closeSection"
      bgColor="bg-orange-5"
    >
      {{ title }}
      <q-tooltip
        class="bg-light-green-9"
        anchor="top middle"
        self="bottom left"
        :offset="[10, 10]"
      >
        {{ description }}
      </q-tooltip>
    </Bar>
    <div class="param-container">
      <q-item>
        <q-item-section class="col">
          <FiltersInput @generateReport="generateReport" />
        </q-item-section>
      </q-item>
    </div>
  </div>
</template>

<script setup>
/*
  Imports
  */
import { provide, reactive, ref } from 'vue';
import FiltersInput from 'src/components/Reports/Shared/FiltersInput.vue';
import Bar from 'src/components/Shared/Bar.vue';
import reportActivePatients from 'src/services/ReportServices/activePatientsDDDModel/reportActivePatientsDDDModel';
import useUtils from 'src/use/useUtils';

const title = ref('Listar pacientes activos na farmácia (Modelo DDD)');
const description = ref('Pacientes activos em DDD a mais de 6 meses');
const loadingPDF = reactive(ref(false));
const loadingXLS = reactive(ref(false));

const generateReport = (params) => {
  if (params.value.fileType === 'PDF') {
    reportActivePatients.downloadPDF(
      null,
      params.value.province.name,
      useUtils.getDateFormatDDMMYYYYDash(params.value.startDate),
      useUtils.getDateFormatDDMMYYYYDash(params.value.endDate),
      params,
      loadingPDF
    );
  } else {
    reportActivePatients.downloadExcel(
      null,
      params.value.province.name,
      useUtils.getDateFormatDDMMYYYYDash(params.value.startDate),
      useUtils.getDateFormatDDMMYYYYDash(params.value.endDate),
      params,
      loadingXLS
    );
  }
};

const filterDrugStoreSection = ref(null);
const closeSection = () => {
  filterDrugStoreSection.value.remove();
};

provide('loadingPDF', loadingPDF);
provide('loadingXLS', loadingXLS);
</script>

<style lang="scss" scoped>
.param-container {
  border-bottom: 1px dashed $grey-13;
  border-left: 1px dashed $grey-13;
  border-right: 1px dashed $grey-13;
  border-radius: 0px 0px 5px 5px;
}
</style>
