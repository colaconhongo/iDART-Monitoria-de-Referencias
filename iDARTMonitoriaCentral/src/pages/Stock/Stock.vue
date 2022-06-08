<template>
  <Filter :is="true" />
  <div class="q-pa-md q-pt-sm">
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
import { onMounted, reactive, ref, provide, computed, onActivated, onDeactivated } from 'vue';
import {  SessionStorage } from 'quasar';
import Filter from 'src/components/Filter/Filter.vue';
 import ProvinceService from 'src/services/provinceService/provinceService';
import DistrictService from 'src/services/districtService/districtService';
import ClinicService from 'src/services/clinicService/clinicService';
/*
Declarations
*/
const $q = new useQuasar();
const showStockSearch = reactive(ref(true));
const stockData = reactive(ref([]));
let selectRecord = reactive(ref({}));
const provincia = reactive(ProvinceService.getFirstProvinceByNameFromStorage());
const district = reactive(ref());
const pharmacy = reactive(ref());


/*
  Computed
*/
const allProvincias = computed(() => {
  return ProvinceService.getAllFromStorage();
});

const districtsByProvince = computed(() => {
    console.log(DistrictService.getAllProvinceFromStorage())
  return DistrictService.getAllProvinceFromStorage();
});


const DDPharmByDistrict = computed(() => {
    if(district.value != null || district.value != undefined) {
  return ClinicService.getAllPharmacyFromDistrict(district.value.name);
    }
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
  console.log(selectRecord);
};

const goBack = () => {
  showStockSearch.value = true;
};

/*
  Activated && deActivated
*/
onActivated(() => {
    if (SessionStorage.getItem('district') !== null) {
    district.value = SessionStorage.getItem('district')
  }
    if (SessionStorage.getItem('pharmacy') !== null) {
    pharmacy.value = SessionStorage.getItem('pharmacy')
  }
 console.log(district)
});

onDeactivated(() => {
  console.log(district)
  console.log(pharmacy)
   if(district.value != null || district.value != undefined) SessionStorage.set('district', district.value)
  if(pharmacy.value != null || pharmacy.value != undefined)   SessionStorage.set('pharmacy', pharmacy.value)

});

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
