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
import reportReferidosDeVolta from 'src/services/ReportServices/referidosDeVolta/reportReferidosDeVolta';
import useUtils from 'src/use/useUtils';

const title = ref('Lista de Pacientes que Voltaram da Referência');

const generateReport = (params) => {
  if (params.value.fileType === 'PDF') {
    reportReferidosDeVolta.downloadPDF(
      null,
      params.value.province.name,
       useUtils.getDateFormatDDMMYYYYDash(params.value.startDate),
      useUtils.getDateFormatDDMMYYYYDash(params.value.endDate),
      params
    );
  } else {
    reportReferidosDeVolta.downloadExcel(
      null,
      params.value.province.name,
      useUtils.getDateFormatDDMMYYYYDash(params.value.startDate),
      useUtils.getDateFormatDDMMYYYYDash(params.value.endDate),
      params
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
