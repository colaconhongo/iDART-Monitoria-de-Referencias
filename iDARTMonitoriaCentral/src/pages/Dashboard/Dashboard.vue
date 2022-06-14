<template>
  <div class="q-pa-sm q-gutter-md">
    <Filter :is="true" :isDashboard="isDashboard" />
    <q-bar dense dark class="bg-primary"> </q-bar>
    <totalSummary />
    <chartReferralByPharmacy v-model:loaded="loaded" />
    <chartDispenseByDrug v-model:loaded="loaded" />
    <chartBarReffered v-model:loaded="loaded" />
    <lineChart v-model:loaded="loaded" />
  </div>
</template>
<script setup>
import { useQuasar, QSpinnerBall, LocalStorage, SessionStorage } from 'quasar';
import {
  computed,
  onMounted,
  ref,
  reactive,
  provide,
  watch,
  onActivated,
  onDeactivated,
} from 'vue';
import ProvinceService from 'src/services/provinceService/provinceService';
import DistrictService from 'src/services/districtService/districtService';
import ClinicService from 'src/services/clinicService/clinicService';
import EpisodeService from 'src/services/episodeService/episodeService';
import DispenseService from 'src/services/dispenseService/dispenseService';
import patientService from 'src/services/patientService/patientService';
import VueApexCharts from 'vue3-apexcharts';
import randomcolor from 'randomcolor';
import moment from 'moment';
import DashboardUtils from '../../use/DashboardUtils';
import Filter from 'src/components/Filter/Filter.vue';
import totalSummary from 'src/components/Dashboard/ChartsSummary.vue';
import chartReferralByPharmacy from '../../components/Dashboard/BarReportRefferedByPharmacyPatient.vue';
import chartDispenseByDrug from '../../components/Dashboard/BarReportDispenseByDrug.vue';
import lineChart from '../../components/Dashboard/PieLineDispenseTypeAndRegime.vue';
import chartBarReffered from '../../components/Dashboard/BarReportRefferedPatient.vue';
const provincia = reactive(ProvinceService.getFirstProvinceByNameFromStorage());
let district = ref();
let pharmacy = ref();
const apexchart = VueApexCharts;
let year = ref(2022);
const $q = useQuasar();
const isDashboard = ref(true);

let loaded = reactive({
  loaded: false,
});

/*
  Watch
*/
watch(year, () => {
  $q.loading.show({
    message: 'Carregando ...',
    spinnerColor: 'grey-4',
    spinner: QSpinnerBall,
  });
  EpisodeService.getEpisodesByYear(year.value).then(() => {
    DispenseService.getDispensesByRegimeByYear(year.value).then(() => {
      patientService.getPatientsByYear(year.value).then(() => {
        loaded.loaded = ref(true);
        $q.loading.hide();
      });
    });
  });
});

watch(district, () => {
  $q.loading.show({
    message: 'Carregando ...',
    spinnerColor: 'grey-4',
    spinner: QSpinnerBall,
  });
  // SessionStorage.set('district', district.value)
  loaded.loaded = ref(true);
  $q.loading.hide();
});

watch(pharmacy, () => {
  $q.loading.show({
    message: 'Carregando ...',
    spinnerColor: 'grey-4',
    spinner: QSpinnerBall,
  });

  loaded.loaded = ref(true);
  $q.loading.hide();
});

/*
  Computed
*/
const allProvincias = computed(() => {
  return ProvinceService.getAllFromStorage();
});

const districtsByProvince = computed(() => {
  return DistrictService.getAllProvinceFromStorage();
});

const DDPharmByDistrict = computed(() => {
  if (district.value != null || district.value != undefined) {
    return ClinicService.getAllPharmacyFromDistrict(district.value.name);
  }
});

const yearsToShow = DashboardUtils.getLastFiveYears();

let total = reactive({
  totalNumbers: 0,
  totalBackNumbers: 0,
  totalMaleNumbers: 0,
  totalFemaleNumbers: 0,
});

provide('total', total);
provide('district', district);
provide('pharmacy', pharmacy);
provide('allProvincias', allProvincias);
provide('province', provincia);
provide('alldistrictsFromProvince', districtsByProvince);
provide('allPhamacyFromFacility', DDPharmByDistrict);
provide('yearsToShow', yearsToShow);
provide('year', year);
/*
   On Page Mounted
*/
onMounted(() => {
  // EpisodeService.get(0);
  $q.loading.show({
    message: 'Carregando ...',
    spinnerColor: 'grey-4',
    spinner: QSpinnerBall,
  });
  EpisodeService.getEpisodesByYear(year.value).then(() => {
    DispenseService.getDispensesByRegimeByYear(year.value).then(() => {
      patientService.getPatientsByYear(year.value).then(() => {
        loaded.loaded = ref(true);
        //   district = DistrictService.getDistrictFromStorage(LocalStorage.getItem('district').id)
        //  if (SessionStorage.getItem('district') !== null) {
        //  district = SessionStorage.getItem('district')
        // }
        $q.loading.hide();
      });
    });
  });
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
</script>

<style lang="scss" scoped>
.background {
  background-color: $grey-2;
}
.my-card {
  border-radius: 20px;
  background-color: white;
}

.text-font {
  font-size: 13px;
  font-family: 'Arial', Sans-serif;
}

.text-bold {
  font-family: 'Monaco', Monospace;
  font-weight: bold;
}
</style>
