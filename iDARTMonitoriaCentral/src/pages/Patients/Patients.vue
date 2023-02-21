<template>
  <q-page class="q-pa-sm q-gutter-md">
    <Filter v-if="activePatientList" />
    <q-bar v-if="activePatientList" dense dark class="bg-primary"> </q-bar>
    <PatientList v-if="activePatientList" v-model:title="titleList" />
    <PatientView v-else />
  </q-page>
</template>

<script setup>
import { QSpinnerBall, SessionStorage, useQuasar } from 'quasar';
import {
  provide,
  reactive,
  ref,
  computed,
  onActivated,
  onDeactivated,
  onUpdated,
  onMounted,
} from 'vue';
import PatientList from 'src/components/patients/PatientList.vue';
import PatientView from 'src/components/patients/PatientView.vue';
import Filter from 'src/components/Filter/Filter.vue';
import ProvinceService from 'src/services/provinceService/provinceService';
import DistrictService from 'src/services/districtService/districtService';
import ClinicService from 'src/services/clinicService/clinicService';
import DashboardUtils from '../../use/DashboardUtils';
import provinceService from 'src/services/provinceService/provinceService';
import districtService from 'src/services/districtService/districtService';
import clinicService from 'src/services/clinicService/clinicService';
import PatientService from 'src/services/patientService/patientService';

const $q = useQuasar();
const district = reactive(ref());
const pharmacy = reactive(ref());
const titleList = reactive(ref('Pacientes'));
const localPatient = reactive(ref([]));
const activePatientList = reactive(ref(true));
let year = ref(new Date().getFullYear());
const yearsToShow = DashboardUtils.getLastFiveYears();

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
  return null;
});

const viewPatient = (patientRow) => {
  localPatient.value = patientRow;
  activePatientList.value = false;
};

const patient = computed({
  get() {
    return PatientService.getPatientByUUidFromStorage(
      localPatient.value.uuidopenmrs
    );
  },
  set(newValue) {
    patient = newValue;
  },
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
    }, 1000);
    provinceService.get(0);
    districtService.get(0);
    clinicService.get(0);
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
  if (SessionStorage.getItem('pharmacy') !== null) {
    pharmacy.value = SessionStorage.getItem('pharmacy');
  }
});

onDeactivated(() => {
  if (district.value !== null && district.value !== undefined)
    SessionStorage.set('district', district.value);
  if (pharmacy.value !== null && pharmacy.value !== undefined)
    SessionStorage.set('pharmacy', pharmacy.value);
});

const goBack = () => {
  activePatientList.value = true;
};

provide('titleList', titleList);
provide('viewPatient', viewPatient);
provide('patient', patient);
provide('activePatientList');
provide('pharmacy', pharmacy);
provide('allProvincias', allProvincias);
provide('province', provincia);
provide('district', district);
provide('pharmacy', pharmacy);
provide('alldistrictsFromProvince', districtsByProvince);
provide('allPhamacyFromFacility', DDPharmByDistrict);
provide('goBack', goBack);
provide('yearsToShow', yearsToShow);
provide('year', year);
</script>
