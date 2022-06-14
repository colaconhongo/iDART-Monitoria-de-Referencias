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
import { useQuasar, QSpinnerBall, SessionStorage } from 'quasar';
import Filter from 'src/components/Filter/Filter.vue';
import provinceService from 'src/services/provinceService/provinceService';
import clinicService from 'src/services/clinicService/clinicService';
import DistrictService from 'src/services/districtService/districtService';
import {
  onMounted,
  reactive,
  ref,
  provide,
  computed,
  onActivated,
  onDeactivated,
} from 'vue';
/*
Declarations
*/
const $q = new useQuasar();
const showStockSearch = reactive(ref(true));
const stockData = reactive(ref([]));
let selectRecord = reactive(ref({}));
const district = reactive(ref());
const pharmacy = reactive(ref());
const provincia = reactive(
  ref(provinceService.getFirstProvinceByNameFromStorage())
);

/*
  Computed
*/
const allProvincias = computed(() => {
  return provinceService.getAllFromStorage();
});

const districtsByProvince = computed(() => {
  return DistrictService.getAllProvinceFromStorage();
});

const DDPharmByDistrict = computed(() => {
  if (district.value != null || district.value != undefined) {
    return clinicService.getAllPharmacyFromDistrict(district.value.name);
  }
  return [];
});

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
};

const goBack = () => {
  showStockSearch.value = true;
};

/*
  Computed
*/

const allFacilityFromDistrict = computed(() => {
  return clinicService.getAllUSFromDistrict(district.value.name);
});

onActivated(() => {
  if (SessionStorage.getItem('district') !== null) {
    district.value = SessionStorage.getItem('district');
  }
  if (SessionStorage.getItem('pharmacy') !== null) {
    pharmacy.value = SessionStorage.getItem('pharmacy');
  }
});

onDeactivated(() => {
  if (district.value != null || district.value != undefined)
    SessionStorage.set('district', district.value);
  if (pharmacy.value != null || pharmacy.value != undefined)
    SessionStorage.set('pharmacy', pharmacy.value);
});

provide('allFacilityFromDistrict', allFacilityFromDistrict);

provide('viewStock', viewStock);
provide('selectRecord', selectRecord);
provide('pharmacy', pharmacy);
provide('allProvincias', allProvincias);
provide('province', provincia);
provide('district', district);
provide('pharmacy', pharmacy);
provide('alldistrictsFromProvince', districtsByProvince);
provide('allPhamacyFromFacility', DDPharmByDistrict);
</script>

<style></style>
