<template>
  <div class="q-pa-md q-pt-sm">
    <Filter :is="true" />
    <div class="row">
      <div class="col-3 q-ml-sm q-mr-sm" style="max-width: 500px">
        <q-bar dark class="bg-primary text-white">
          <div class="col text-center text-weight-bold">Listagens</div>
        </q-bar>
      </div>
      <div class="col q-mr-sm">
        <q-bar dark class="bg-primary text-white">
          <div class="col text-center text-weight-bold">Resultados</div>
        </q-bar>
      </div>
    </div>

    <div class="row">
      <div class="col-3 q-ml-sm q-mr-sm panel" style="max-width: 500px">
        <ListReportMenu @changeTab="changeTab" />
      </div>
      <div class="col q-mr-sm panel q-pa-sm">
        <template v-for="comp in components" :key="comp.id">
          <component :is="reportComps[comp.name]" class="q-mb-sm" />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
/*
  Imports
  */
import ListReportMenu from 'src/components/Reports/Menu/ListReportMenu.vue';
import ReferedPatientsList from 'src/components/Reports/ReferedPatientsList.vue';
import { uid,SessionStorage } from 'quasar';
import { reactive, ref, provide, computed,onActivated,onDeactivated } from 'vue';
import Filter from 'src/components/Filter/Filter.vue';
import provinceService from 'src/services/provinceService/provinceService';
import clinicService from 'src/services/clinicService/clinicService';
import districtService from 'src/services/districtService/districtService';

let components = reactive([]);
const province = reactive(
  ref(provinceService.getFirstProvinceByNameFromStorage())
);
const reportComps = {
  ReferedPatientsList,
};
const district = reactive(ref([]));
const facility = reactive(ref([]));
const pharmacy = reactive(ref([]));

/*
  Methods
  */
const changeTab = (tabName) => {
  const uidValue = 'report' + uid();
  const comp = { id: uidValue, name: tabName };
  components.push(comp);
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

onActivated(() => {
  if (SessionStorage.getItem('district') !== null) {
    district.value = SessionStorage.getItem('district');
  }
  if (SessionStorage.getItem('pharmacy') !== null) {
    pharmacy.value = SessionStorage.getItem('pharmacy');
  }
  console.log(district);
});

onDeactivated(() => {
  console.log(district);
  console.log(pharmacy);
  if (district.value != null || district.value != undefined)
    SessionStorage.set('district', district.value);
  if (pharmacy.value != null || pharmacy.value != undefined)
    SessionStorage.set('pharmacy', pharmacy.value);
});

provide('allProvincias', allProvincias);
provide('alldistrictsFromProvince', alldistrictsFromProvince);
provide('allFacilityFromDistrict', allFacilityFromDistrict);
provide('allPhamacyFromFacility', allPhamacyFromFacility);

provide('province', province);
provide('district', district);
provide('facility', facility);
provide('pharmacy', pharmacy);
</script>

<style lang="scss" scoped>
.panel {
  border: 1px solid $grey-13;
  border-radius: 0px;
}
</style>
