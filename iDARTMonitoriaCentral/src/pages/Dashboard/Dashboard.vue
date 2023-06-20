<template>
  <div class="q-pa-sm q-gutter-md">
    <Filter :isDashboard="isDashboard" />
    <q-bar dense dark class="bg-primary"> </q-bar>
    <div class="row">
      <q-space />
      <q-select
        class="col-2 q-my-md"
        dense
        outlined
        option-label="description"
        v-model="selectedMode"
        :options="dispenseModels"
        label="Tipo de Modelo de Dispensa"
      />
    </div>
    <q-separator color="grey-13" size="1px" />
    <totalSummary />
    <chartReferralByPharmacy v-model:loaded="loaded" />
    <chartDispenseByDrug v-model:loaded="loaded" />
    <chartBarReffered v-model:loaded="loaded" />
    <lineChart v-model:loaded="loaded" />
  </div>
</template>
<script setup>
import { useQuasar, QSpinnerBall, SessionStorage } from 'quasar';
import {
  computed,
  onMounted,
  ref,
  reactive,
  provide,
  watch,
  onActivated,
  onDeactivated,
  onUpdated,
} from 'vue';
import ProvinceService from 'src/services/provinceService/provinceService';
import DistrictService from 'src/services/districtService/districtService';
import ClinicService from 'src/services/clinicService/clinicService';
import EpisodeService from 'src/services/episodeService/episodeService';
import DispenseService from 'src/services/dispenseService/dispenseService';
import patientService from 'src/services/patientService/patientService';
import DashboardUtils from '../../use/DashboardUtils';
import Filter from 'src/components/Filter/Filter.vue';
import totalSummary from 'src/components/Dashboard/ChartsSummary.vue';
import chartReferralByPharmacy from '../../components/Dashboard/BarReportRefferedByPharmacyPatient.vue';
import chartDispenseByDrug from '../../components/Dashboard/BarReportDispenseByDrug.vue';
import lineChart from '../../components/Dashboard/PieLineDispenseTypeAndRegime.vue';
import chartBarReffered from '../../components/Dashboard/BarReportRefferedPatient.vue';
import PatientService from 'src/services/patientService/patientService';
import clinicSectorService from 'src/services/clinicSectorService/clinicSectorService';
import clinicService from 'src/services/clinicService/clinicService';

let district = ref();
let pharmacy = ref();
let us = ref();
let year = ref(new Date().getFullYear());
const $q = useQuasar();
const isDashboard = ref(true);

let loaded = reactive({
  loaded: false,
});

const selectedMode = ref({
  id: 0,
  description: 'Dispensa Discentralizada',
  abbreviation: 'MDD',
});
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
        setTimeout(() => {
          $q.loading.hide();
        }, 600);
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
  setTimeout(() => {
    $q.loading.hide();
  }, 600);
});

watch(pharmacy, () => {
  $q.loading.show({
    message: 'Carregando ...',
    spinnerColor: 'grey-4',
    spinner: QSpinnerBall,
  });

  loaded.loaded = ref(true);
  setTimeout(() => {
    $q.loading.hide();
  }, 600);
});

watch(us, () => {
  $q.loading.show({
    message: 'Carregando ...',
    spinnerColor: 'grey-4',
    spinner: QSpinnerBall,
  });

  loaded.loaded = ref(true);
  setTimeout(() => {
    $q.loading.hide();
  }, 600);
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
    let pharmaciesResult;
    if (us.value != null || us.value != undefined) {
      // Query com filtro por US
      const lst = PatientService.getPharmaciesIdsByUS(us.value.mainclinicuuid);
      pharmaciesResult = ClinicService.getPharmaciesByUuidList(lst); // Retorna Clinicas privadas para as quais a 'US' referenciou seus pacientes
    } else {
      // Query com filtro por Distrito apenas
      pharmaciesResult = ClinicService.getAllPharmacyFromDistrict(
        district.value.name
      );
    }
    return pharmaciesResult;
  } else return [];
});

const allUS = computed(() => {
  if (district.value != null || district.value != undefined) {
    return clinicService.getReferralClinicByDistrict(district.value.name);
  } else return [];
});

const yearsToShow = DashboardUtils.getLastFiveYears();

let total = reactive({
  totalNumbers: 0,
  totalBackNumbers: 0,
  totalMaleNumbers: 0,
  totalFemaleNumbers: 0,
});

/*
  Mounted Hooks
*/
onUpdated ==
  onMounted(() => {
    ProvinceService.get(0);
    DistrictService.get(0);
    ClinicService.get(0);
    clinicSectorService.get(0);

    EpisodeService.getEpisodesByYear(year.value).then(() => {
      DispenseService.getDispensesByRegimeByYear(year.value).then(() => {
        patientService.getPatientsByYear(year.value).then(() => {
          loaded.loaded = ref(true);
        });
      });
    });
  });

/*
  Computed
*/
const provincia = computed(() => {
  return ProvinceService.getFirstProvinceByNameFromStorage();
});

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
  if (district.value !== null && district.value !== undefined)
    SessionStorage.set('district', district.value);
  if (us.value !== null && us.value !== undefined)
    SessionStorage.set('us', us.value);
  if (pharmacy.value !== null && pharmacy.value !== undefined)
    SessionStorage.set('pharmacy', pharmacy.value);
});

provide('total', total);
provide('district', district);
provide('pharmacy', pharmacy);
provide('us', us);
provide('allProvincias', allProvincias);
provide('province', provincia);
provide('alldistrictsFromProvince', districtsByProvince);
provide('allUSFromDistrict', allUS);
provide('allPhamacyFromFacility', DDPharmByDistrict);
provide('yearsToShow', yearsToShow);
provide('year', year);
provide('selectedModel', selectedMode);
provide('dispenseModels', dispenseModels);
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
