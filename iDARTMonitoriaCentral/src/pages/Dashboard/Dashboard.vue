<template>
  <div class="background">
    <div class="q-mt-lg">
      <div class="row">
        <q-select
          label="Província"
          tack-label
          dense
          class="col q-ml-md"
          v-model="provincia"
          use-input
          fill-input
          hide-selected
          :options="allProvincias"
          disable
          option-label="name"
          option-value="id"
        />
        <q-select
          dense
          label="Distrito"
          tack-label
          class="col q-ml-xl"
          v-model="district"
          use-input
          fill-input
          hide-selected
          :options="districtsByProvince"
          option-label="name"
          option-value="id"
        />
        <q-select
          dense
          label="Unidade Sanitaria"
          tack-label
          class="col q-ml-xl"
          v-model="clinic"
          :disable="true"
          use-input
          fill-input
          hide-selected
          :options="clinicsByDistrict"
          option-label="clinicname"
          option-value="id"
        />
        <q-select
          label="Farmacia de Referencias"
          tack-label
          dense
          class="col q-ml-xl"
          v-model="pharmacy"
          use-input
          fill-input
          hide-selected
          :options="DDPharmByDistrict"
          option-label="clinicname"
          option-value="id"
        />
        <q-select
          tack-label
          dense
          class="col q-ml-xl"
          v-model="yearAnnualPeriod"
          use-input
          fill-input
          hide-selected
          :options="yearsToShow"
          option-label="name"
          option-value="name"
        />
      </div>
      <br />
      <q-bar dense dark class="bg-primary"> </q-bar>
      <div class="q-pa-md row items-start q-gutter-md justify-center">
        <q-card class="my-card" flat bordered>
          <q-item>
            <q-item-section avatar icon="person">
              <q-icon name="people"></q-icon>
            </q-item-section>

            <q-item-section>
              <q-item-label>Total de Pacientes Referidos</q-item-label>
            </q-item-section>
          </q-item>
          <q-card-section horizontal>
            <q-separator />
            <q-card-section class="col-4">
              {{ total.totalNumbers }}
            </q-card-section>
          </q-card-section>
        </q-card>
        <q-card class="my-card" flat bordered>
          <q-item>
            <q-item-section avatar icon="person">
              <q-icon name="person"></q-icon>
            </q-item-section>

            <q-item-section>
              <q-item-label
                >Total de Pacientes Que Voltaram para US</q-item-label
              >
            </q-item-section>
          </q-item>
          <q-card-section horizontal>
            <q-separator />

            <q-card-section class="col-4">
              {{ total.totalBackNumbers }}
            </q-card-section>
          </q-card-section>
        </q-card>
        <q-card class="my-card" flat bordered>
          <q-item>
            <q-item-section>
              <q-item-label
                >Total de Pacientes referidos por Genero</q-item-label
              >
            </q-item-section>
          </q-item>
          <q-card-section horizontal>
            <q-item-section avatar>
              <q-icon name="woman"></q-icon>
            </q-item-section>

            <q-card-section class="col-4">
              {{ total.totalFemaleNumbers }}
            </q-card-section>
            <q-item-section avatar>
              <q-icon name="man"></q-icon>
            </q-item-section>

            <q-card-section class="col-4">
              {{ total.totalMaleNumbers }}
            </q-card-section>
          </q-card-section>
        </q-card>
      </div>
      <q-separator />
      <chartReferralByPharmacy v-model:loaded="loaded" />
      <q-separator />
      <chartDispenseByDrug v-model:loaded="loaded" />
      <q-separator />
      <chartBarReffered v-model:loaded="loaded" />
      <q-separator />
      <lineChart v-model:loaded="loaded" />
    </div>
  </div>
</template>
<script setup>
import { useQuasar, QSpinnerBall, LocalStorage } from 'quasar';
import ProvinceService from 'src/services/provinceService/provinceService';
import DistrictService from 'src/services/districtService/districtService';
import ClinicService from 'src/services/clinicService/clinicService';
import EpisodeService from 'src/services/episodeService/episodeService';
import DispenseService from 'src/services/dispenseService/dispenseService';
import patientService from 'src/services/patientService/patientService';
import VueApexCharts from 'vue3-apexcharts';
//import VueRandomColor from 'vue-randomcolor';
import randomcolor from 'randomcolor';
import {
  computed,
  onMounted,
  ref,
  onBeforeMount,
  reactive,
  provide,
  watch,
} from 'vue';
import moment from 'moment';
import chartReferralByPharmacy from '../../components/Dashboard/BarReportRefferedByPharmacyPatient.vue';
import chartDispenseByDrug from '../../components/Dashboard/BarReportDispenseByDrug.vue';
import lineChart from '../../components/Dashboard/PieLineDispenseTypeAndRegime.vue';
import chartBarReffered from '../../components/Dashboard/BarReportRefferedPatient.vue';
const provincia = ref(ProvinceService.getFirstProvinceByNameFromStorage());
let district = ref();
let clinic = ref();
let pharmacy = ref();
const apexchart = VueApexCharts;
let yearAnnualPeriod = ref(2022);
let annualFilter = ref([]);
const $q = useQuasar();

/*
  Computed
*/
/*const startEpisode = computed(() => {
   // console.log(EpisodeService.getAllStartEpisode())
  return EpisodeService.getAllFromStorage();
});*/

let loaded = reactive({
  loaded: false,
});

const setSelectedYearAnnual = (yearAnnualPeriod) => {
  yearAnnualPeriod.yearAnnualPeriod = yearAnnualPeriod;
  annualFilter = yearAnnualPeriod;
  console.log(yearAnnualPeriod);
  console.log(annualFilter);
};

watch(yearAnnualPeriod, () => {
  console.log(yearAnnualPeriod);
  console.log(yearAnnualPeriod);
  $q.loading.show({
    message: 'Carregando ...',
    spinnerColor: 'grey-4',
    spinner: QSpinnerBall,
  });
  console.log(yearAnnualPeriod);
  EpisodeService.getEpisodesByYear(yearAnnualPeriod.value).then(() => {
    DispenseService.getDispensesByRegimeByYear(yearAnnualPeriod.value).then(
      () => {
        patientService.getPatientsByYear(yearAnnualPeriod.value).then(() => {
          loaded.loaded = ref(true);
          $q.loading.hide();
        });
      }
    );
  });
});

watch(district, () => {
  console.log(district);
  console.log(district);
  clinic = ref(null);
  console.log(clinic);
  $q.loading.show({
    message: 'Carregando ...',
    spinnerColor: 'grey-4',
    spinner: QSpinnerBall,
  });
  console.log(yearAnnualPeriod);

  loaded.loaded = ref(true);
  $q.loading.hide();
});

watch(clinic, () => {
  console.log(clinic);
  console.log(clinic);
  $q.loading.show({
    message: 'Carregando ...',
    spinnerColor: 'grey-4',
    spinner: QSpinnerBall,
  });
  console.log(clinic);

  loaded.loaded = ref(true);
  $q.loading.hide();
});

watch(pharmacy, () => {
  console.log(pharmacy);
  console.log(pharmacy);
  $q.loading.show({
    message: 'Carregando ...',
    spinnerColor: 'grey-4',
    spinner: QSpinnerBall,
  });
  console.log(pharmacy);

  loaded.loaded = ref(true);
  $q.loading.hide();
});

onMounted(() => {
  // EpisodeService.get(0);
  $q.loading.show({
    message: 'Carregando ...',
    spinnerColor: 'grey-4',
    spinner: QSpinnerBall,
  });
  console.log(yearAnnualPeriod);
  EpisodeService.getEpisodesByYear(yearAnnualPeriod.value).then(() => {
    DispenseService.getDispensesByRegimeByYear(yearAnnualPeriod.value).then(
      () => {
        patientService.getPatientsByYear(yearAnnualPeriod.value).then(() => {
          loaded.loaded = ref(true);
          $q.loading.hide();
        });
      }
    );
  });
});

const allProvincias = computed(() => {
  return ProvinceService.getAllFromStorage();
});

const districtsByProvince = computed(() => {
  console.log(DistrictService.getAllProvinceFromStorage());
  return DistrictService.getAllProvinceFromStorage();
});

const clinicsByDistrict = computed(() => {
  // console.log(DistrictService.getAllProvinceFromStorage())
  if (district.value !== undefined) {
    return ClinicService.getAllUsByDistrict(district.value);
  }
});

const DDPharmByDistrict = computed(() => {
  if (district.value !== undefined) {
    return ClinicService.getAllDDPharmByDistrict(district.value);
  }
});

const yearsToShow = ref([2017, 2018, 2019, 2020, 2021, 2022]);

let total = reactive({
  totalNumbers: 0,
  totalBackNumbers: 0,
  totalMaleNumbers: 0,
  totalFemaleNumbers: 0,
});

provide('total', total);
provide('yearAnnualPeriod', yearAnnualPeriod);
provide('district', district);
provide('clinic', clinic);
provide('pharmacy', pharmacy);
/*
   On Page Mounted
*/
</script>

<style lang="scss" scoped>
.background {
  background-color: $grey-2;
}
.my-card {
  border-radius: 20px;
  background-color: white;
}
</style>
