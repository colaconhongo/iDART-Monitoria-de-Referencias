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
import reportNotSyncDispense from 'src/services/ReportServices/notSyncDispense/reportNotSyncDispense';
import moment from 'moment'

const title = ref('Lista de Dispensas que não Foram Sincronizadas');

const generateReport = (params) => {
  console.log(params)
   if (params.value.fileType === 'PDF') {
  reportNotSyncDispense.downloadPDF(
    null,
    params.value.province.name,
    moment(params.value.startDate,'DD-MM-YYYY').format('DD/MM/YYYY'),
    moment(params.value.endDate,'DD-MM-YYYY').format('DD/MM/YYYY'),
    params
  );
   } else {
    reportNotSyncDispense.downloadExcel(
      null,
      params.value.province.name,
      moment(params.value.startDate,'DD-MM-YYYY').format('DD/MM/YYYY'),
      moment(params.value.endDate,'DD-MM-YYYY').format('DD/MM/YYYY'),
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
