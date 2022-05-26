<template>
  <stockSearch v-model:title="titleList" />
</template>

<script setup>
  /*
    Imports
  */
  import stockSearch from 'src/components/stock/StockSearch.vue'
  import { useQuasar, QSpinnerBall } from 'quasar';
  import { computed, onMounted, reactive, ref } from 'vue';
  import stockService from 'src/services/stockService/stockService';
  import drugService from 'src/services/drugService/drugService';
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
  getAllDrugsFromAPI(0);
  getAllStockFromAPI(0);
});

/*
  Computed
*/
const allStock = computed(() => {
  return stockService.getAllFromStorage();
});

/*
  Methods
*/
const getAllStockFromAPI = (offset) => {
  if (offset >= 0) {
    stockService.get(offset);
  }
};
const getAllDrugsFromAPI = (offset) => {
  if (offset >= 0) {
    drugService.get(offset);
  }
};
</script>

<style>

</style>
