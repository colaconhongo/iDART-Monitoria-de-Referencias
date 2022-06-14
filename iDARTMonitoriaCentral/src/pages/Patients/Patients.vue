<template>
  <q-page class="q-pa-sm q-gutter-md">
    <Filter :is="true" v-if="activePatientList" />
    <q-bar v-if="activePatientList" dense dark class="bg-primary"> </q-bar>
    <PatientList v-if="activePatientList" v-model:title="titleList" />
    <PatientView v-else />
  </q-page>
</template>

<script setup>
import { SessionStorage } from 'quasar';
import {
  provide,
  reactive,
  ref,
  computed,
  onActivated,
  onDeactivated,
} from 'vue';
import PatientList from 'src/components/patients/PatientList.vue';
import PatientView from 'src/components/patients/PatientView.vue';
import Filter from 'src/components/Filter/Filter.vue';
import ProvinceService from 'src/services/provinceService/provinceService';
import DistrictService from 'src/services/districtService/districtService';
import ClinicService from 'src/services/clinicService/clinicService';
const provincia = reactive(ProvinceService.getFirstProvinceByNameFromStorage());
const district = reactive(ref());
const pharmacy = reactive(ref());
const titleList = reactive(ref('Pacientes'));
const patient = reactive(ref([]));
const activePatientList = reactive(ref(true));

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
  patient.value = patientRow;
  activePatientList.value = false;
};

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
</script>
