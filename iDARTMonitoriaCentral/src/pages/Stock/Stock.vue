<template>
  <div class="q-pa-md q-pt-sm">
  <Filter :is="true" v-if="showStockSearch" />
    <stockDetails v-if="!showStockSearch" @goBack="goBack" />
    <stockSearch v-if="showStockSearch" />
  </div>
</template>

<script setup>
/*
    Imports
  */
import stockSearch from 'src/components/stock/StockSearch.vue';
import stockDetails from 'src/components/stock/StockDetails.vue';
import { useQuasar, QSpinnerBall } from 'quasar';
import { onMounted, reactive, ref, provide, computed } from 'vue';
import Filter from 'src/components/Filter/Filter.vue';
import provinceService from 'src/services/provinceService/provinceService';
import clinicService from 'src/services/clinicService/clinicService';
import districtService from 'src/services/districtService/districtService';
/*
Declarations
*/
const $q = new useQuasar();
const showStockSearch = reactive(ref(true));
const stockData = reactive(ref([]));
let selectRecord = reactive(ref({}));
const district = reactive(ref([]));
const facility = reactive(ref([]));
const pharmacy = reactive(ref([]));
const province = reactive(
  ref(provinceService.getFirstProvinceByNameFromStorage())
);
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
  console.log(selectRecord);
};

const goBack = () => {
  showStockSearch.value = true;
};

/*
  Computed
*/
const allProvincias = computed(() => {
  return provinceService.getAllFromStorage();
});

const alldistrictsFromProvince = computed(() => {
  return districtService.getAllProvinceFromStorage();
});

const allFacilityFromDistrict = computed(() => {
  return clinicService.getAllUSFromDistrict(district.value.name);
});

const allPhamacyFromFacility = computed(() => {
  return clinicService.getAllPharmacyFromDistrict(district.value.name);
});

provide('allProvincias', allProvincias);
provide('alldistrictsFromProvince', alldistrictsFromProvince);
provide('allFacilityFromDistrict', allFacilityFromDistrict);
provide('allPhamacyFromFacility', allPhamacyFromFacility);

provide('province', province);
provide('district', district);
provide('facility', facility);
provide('pharmacy', pharmacy);
provide('viewStock', viewStock);
provide('selectRecord', selectRecord);
</script>

<style></style>
