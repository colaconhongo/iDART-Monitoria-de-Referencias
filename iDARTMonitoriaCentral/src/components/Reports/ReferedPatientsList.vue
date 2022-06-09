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
// import reportService from 'src/services/ReportServices/reportService';
import { ref } from 'vue';
import FiltersInput from 'src/components/Reports/Shared/FiltersInput.vue';
import Bar from 'src/components/Shared/Bar.vue';
import reportFaltososARV from 'src/services/ReportServices/faltosos/reportFaltososARV';
import reportExcel from 'src/services/ReportServices/faltosos/reportExcelJs';

const title = ref('Lista de Pacientes Referidos para Outras Farmácias');

const generateReport = (params) => {
  console.log(params.value.fileType);
  if (params.value.fileType === 'PDF') {
    reportFaltososARV.downloadPDF(
      'CS Nicoadala',
      'Zambézia',
      '01-01-2020',
      '02-01-2020'
    );
  } else {
    reportFaltososARV.downloadExcel(
      'CS Nicoadala',
      'Zambézia',
      '01-01-2020',
      '02-01-2020'
    );
  }
};

const filterDrugStoreSection = ref(null);
const closeSection = () => {
  filterDrugStoreSection.value.remove();
};
</script>

<style lang="scss" scoped>
.param-container {
  border-bottom: 1px dashed $grey-13;
  border-left: 1px dashed $grey-13;
  border-right: 1px dashed $grey-13;
  border-radius: 0px 0px 5px 5px;
}
</style>
