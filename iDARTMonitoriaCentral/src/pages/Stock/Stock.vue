<template>
  <stockSearch v-model:title="titleList" />
</template>

<script setup>
  /*
    Imports
  */
  import stockSearch from 'src/components/stock/StockSearch.vue'
  import { useQuasar, QSpinnerBall } from 'quasar';
  import {  onMounted, reactive, ref } from 'vue';
  import stockService from 'src/services/stockService/stockService';
  import drugService from 'src/services/drugService/drugService';
  import stockCenterService from 'src/services/stockCenterService/stockCenter';
  import stockLevelService from 'src/services/stockLevelService/stockLevelService';
/*
Declarations
*/
const $q = new useQuasar();
const titleList = reactive(ref('Stock'));

 /*
  Mounted Hooks
*/
onMounted(() => {
  $q.loading.show({
    message: 'Carregando ...',
    spinnerColor: 'grey-4',
    spinner: QSpinnerBall,
  });
  setTimeout(() => {
    $q.loading.hide();
  }, 600);
    /*getAllDrugFromAPI(0);
    getAllStockFromAPI(0);
    getAllStockCenterFromAPI(0);
    getAllStockLevelFromAPI(0);*/
});

/*
  Methods
*/
const getAllDrugFromAPI = (offset) => {
    if (offset >= 0) {
      drugService.get(offset);
    }
  };

  const getAllStockFromAPI = (offset) => {
    if (offset >= 0) {
      stockService.get(offset);
    }
  };

  const getAllStockCenterFromAPI = (offset) => {
    if (offset >= 0) {
      stockCenterService.get(offset);
    }
  };

  const getAllStockLevelFromAPI = (offset) => {
    if (offset >= 0) {
      stockLevelService.get(offset);
    }
  };
</script>

<style>

</style>
