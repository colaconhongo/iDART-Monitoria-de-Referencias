<template>
  <div class="q-pa-sm q-gutter-md">
    <Filter :is="true" />
    <q-bar dense dark class="bg-primary"> </q-bar>
    <q-splitter v-model="splitterModel">
      <template v-slot:before>
        <q-tabs
          v-model="selectedTab"
          vertical
          active-bg-color="white"
          active-color="primary"
          indicator-color="orange"
          class="text-grey"
        >
          <q-tab v-for="tab in tabs" :key="tab.name" v-bind="tab" />
        </q-tabs>
      </template>

      <template v-slot:after>
        <q-tab-panels
          v-model="selectedTab"
          animated
          swipeable
          vertical
          transition-prev="slide-down"
          transition-next="slide-up"
        >
          <q-tab-panel name="clinic">
            <div class="text-h4 q-mb-md"></div>
            <clinics />
          </q-tab-panel>
          <q-tab-panel name="clinic_sector">
            <div class="text-h4 q-mb-md"></div>
            <clinic_sector />
          </q-tab-panel>
          <q-tab-panel name="drugs">
            <div class="text-h4 q-mb-md"></div>
            <drugs />
          </q-tab-panel>
          <q-tab-panel name="regimen">
            <div class="text-h4 q-mb-md"></div>
            <regimen />
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>
  </div>
</template>
<script setup>
import {
  computed,
  provide,
  reactive,
  ref,
  onActivated,
  onDeactivated,
} from 'vue';
import { useI18n } from 'vue-i18n';
import clinics from '../Clinic/Clinic.vue';
import clinic_sector from '../ClinicSector/ClinicSector.vue';
import drugs from '../Drug/Drug.vue';
import regimen from '../Regimen/Regimen.vue';
import Filter from 'src/components/Filter/Filter.vue';
import provinceService from 'src/services/provinceService/provinceService';
import clinicService from 'src/services/clinicService/clinicService';
import districtService from 'src/services/districtService/districtService';
import { SessionStorage } from 'quasar';

/*
  Declaraftion
*/
const { t } = useI18n();
const selectedTab = ref('clinic');
const splitterModel = ref(15);

const province = reactive(
  ref(provinceService.getFirstProvinceByNameFromStorage())
);
const district = reactive(ref());
const facility = reactive(ref());
const pharmacy = reactive(ref());

onActivated(() => {
  if (SessionStorage.getItem('district') !== undefined) {
    district.value = SessionStorage.getItem('district');
  }
  if (SessionStorage.getItem('pharmacy') !== undefined) {
    pharmacy.value = SessionStorage.getItem('pharmacy');
  }
});

onDeactivated(() => {
  if (district.value != null || district.value != undefined)
    SessionStorage.set('district', district.value);
  if (pharmacy.value != null || pharmacy.value != undefined)
    SessionStorage.set('pharmacy', pharmacy.value);
});

/*
  Computed
*/
const allProvincias = computed(() => {
  return provinceService.getAllFromStorage();
});

const alldistrictsFromProvince = computed(() => {
  return districtService.getAllProvinceFromStorage();
});

const allPhamacyFromFacility = computed(() => {
  if (district.value != null || district.value != undefined) {
    return clinicService.getAllPharmacyFromDistrict(district.value.name);
  }
});

provide('allProvincias', allProvincias);
provide('alldistrictsFromProvince', alldistrictsFromProvince);
provide('allPhamacyFromFacility', allPhamacyFromFacility);

provide('province', province);
provide('district', district);
provide('facility', facility);
provide('pharmacy', pharmacy);

const tabs = [
  { name: 'clinic', icon: 'local_hospital', label: t('pharmacy') },
  { name: 'clinic_sector', icon: 'local_pharmacy', label: t('clinicSector') },
  { name: 'drugs', icon: 'medication', label: t('drug') },
  { name: 'regimen', icon: 'healing', label: t('regimen') },
];
</script>
<style></style>
