<template>
  <div class="q-pa-sm q-gutter-md">
    <Filter />
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
          <q-tab-panel name="user">
            <div class="text-h4 q-mb-md"></div>
            <user />
          </q-tab-panel>
          <q-tab-panel name="profile">
            <div class="text-h4 q-mb-md"></div>
            <profile />
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
  onUpdated,
  onMounted,
} from 'vue';
import { useI18n } from 'vue-i18n';
import clinics from '../Clinic/Clinic.vue';
import clinic_sector from '../ClinicSector/ClinicSector.vue';
import drugs from '../Drug/Drug.vue';
import regimen from '../Regimen/Regimen.vue';
import user from '../user/UserSec.vue';
import profile from '../user/Profiles.vue';
import Filter from 'src/components/Filter/Filter.vue';
import provinceService from 'src/services/provinceService/provinceService';
import clinicService from 'src/services/clinicService/clinicService';
import districtService from 'src/services/districtService/districtService';
import DashboardUtils from '../../use/DashboardUtils';
import { QSpinnerBall, SessionStorage, useQuasar } from 'quasar';
import ClinicService from 'src/services/clinicService/clinicService';
import PatientService from 'src/services/patientService/patientService';

/*
  Declaraftion
*/
const $q = useQuasar();

const { t } = useI18n();
const selectedTab = ref('clinic');
const splitterModel = ref(15);
let year = ref(new Date().getFullYear());
const yearsToShow = DashboardUtils.getLastFiveYears();
let us = ref();
let loaded = reactive({
  loaded: false,
});

/*
  Mounted Hooks
*/
onUpdated ==
  onMounted(() => {
    $q.loading.show({
      message: 'Carregando ...',
      spinnerColor: 'grey-4',
      spinner: QSpinnerBall,
    });
    setTimeout(() => {
      $q.loading.hide();
    }, 600);
    provinceService.get(0);
    districtService.get(0);
    clinicService.get(0);
  });

/*
  Computed
*/
const province = computed(() => {
  return provinceService.getFirstProvinceByNameFromStorage();
});

const district = reactive(ref());
const facility = reactive(ref());
const pharmacy = reactive(ref());

onActivated(() => {
  if (SessionStorage.getItem('district') !== null) {
    district.value = SessionStorage.getItem('district');
  }
  if (SessionStorage.getItem('us') !== null) {
    us.value = SessionStorage.getItem('us');
  }
  if (SessionStorage.getItem('pharmacy') !== null) {
    pharmacy.value = SessionStorage.getItem('pharmacy');
  }
});

onDeactivated(() => {
  if (district.value !== null && district.value !== undefined) {
    SessionStorage.set('district', district.value);
  }
  if (us.value !== null && us.value !== undefined)
    SessionStorage.set('us', us.value);
  if (pharmacy.value !== null && pharmacy.value !== undefined) {
    SessionStorage.set('pharmacy', pharmacy.value);
  }
});

/*
  Computed
*/

const USByDistrict = computed(() => {
  if (district.value != null || district.value != undefined) {
    return ClinicService.getAllUSFromDistrict(district.value.name);
  } else return [];
});

const allProvincias = computed(() => {
  return provinceService.getAllFromStorage();
});

const alldistrictsFromProvince = computed(() => {
  return districtService.getAllProvinceFromStorage();
});

const allPhamacyFromFacility = computed(() => {
  if (district.value != null || district.value != undefined) {
    let pharmaciesResult;
    if (us.value != null || us.value != undefined) {
      // Query com filtro por US
      const lst = PatientService.getPharmaciesIdsByUS(us.value.uuid);
      pharmaciesResult = ClinicService.getPharmaciesByUuidList(lst); // Retorna Clinicas privadas para as quais a 'US' referenciou seus pacientes
    } else {
      // Query com filtro por Distrito apenas
      pharmaciesResult = ClinicService.getAllPharmacyFromDistrict(
        district.value.name
      );
    }
    return pharmaciesResult;
  }
  return null;
});

const selectedModel = reactive(
  ref({
    id: 0,
    description: 'Dispensa Discentralizada',
    abbreviation: 'MDD',
  })
);
const dispenseModels = ref([
  {
    id: 0,
    description: 'Dispensa Discentralizada',
    abbreviation: 'MDD',
  },
  {
    id: 1,
    description: 'Distribuição Comunitária',
    abbreviation: 'MDC',
  },
]);

provide('allProvincias', allProvincias);
provide('alldistrictsFromProvince', alldistrictsFromProvince);
provide('allPhamacyFromFacility', allPhamacyFromFacility);

provide('province', province);
provide('district', district);
provide('facility', facility);
provide('pharmacy', pharmacy);
provide('allUSFromDistrict', USByDistrict);
provide('us', us);

provide('yearsToShow', yearsToShow);
provide('year', year);
provide('selectedModel', selectedModel);

const tabs = [
  { name: 'clinic', icon: 'local_hospital', label: 'Farmácia' },
  { name: 'clinic_sector', icon: 'local_pharmacy', label: t('clinicSector') },
  { name: 'drugs', icon: 'medication', label: t('drug') },
  { name: 'regimen', icon: 'healing', label: t('regimen') },
  { name: 'user', icon: 'manage_accounts', label: t('Utilizadores') },
  { name: 'profile', icon: 'admin_panel_settings', label: t('Perfis') },
];
</script>
<style></style>
