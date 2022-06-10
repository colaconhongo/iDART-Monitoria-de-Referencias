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

import { ref } from 'vue';
import FiltersInput from 'src/components/Reports/Shared/FiltersInput.vue';
import Bar from 'src/components/Shared/Bar.vue';
import reportReferidos from 'src/services/ReportServices/referidos/reportReferidos';
import moment from 'moment'


const title = ref('Lista de Pacientes Referidos para Outras Farmácias');

const generateReport = (params) => {
  console.log(params.value.fileType);
    if (params.value.fileType === 'PDF') {
      reportReferidos.downloadPDF(
      null,
      params.value.province.name,
      moment(params.value.startDate).format('DD/MM/YYYY'),
      moment(params.value.endDate).format('DD/MM/YYYY'),
      params
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
