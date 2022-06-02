<template>
  <div>
    <stockDetails
      v-if="!showStockSearch"
      @goBack="goBack"
    />
  <stockSearch
    v-if="showStockSearch"
  />
  </div>
</template>

<script setup>
  /*
    Imports
  */
  import stockSearch from 'src/components/stock/StockSearch.vue'
  import stockDetails from 'src/components/stock/StockDetails.vue';
  import { useQuasar, QSpinnerBall } from 'quasar';
  import {  onMounted, reactive, ref, provide } from 'vue';
/*
Declarations
*/
const $q = new useQuasar();
const showStockSearch = reactive(ref(true));
const stockData = reactive(ref([]));
let selectRecord = reactive(ref({}));

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
  }, 800);
});

/*
  Methods
*/
const viewStock = (stockInfo) => {
  selectRecord.value = stockInfo;
  stockData.value = stockInfo;
  showStockSearch.value = false;
  console.log(selectRecord)
};

const goBack = () => {
  showStockSearch.value = true;
}

provide('viewStock', viewStock);
provide('selectRecord', selectRecord);

</script>

<style>

</style>
