<template>
  <q-page class="q-pa-sm q-gutter-sm">
    <PatientList v-if="activePatientList" v-model:title="titleList" />
    <PatientView v-else />
  </q-page>
</template>

<script setup>
import { provide, reactive, ref } from 'vue';
import PatientList from 'src/components/patients/PatientList.vue';
import PatientView from 'src/components/patients/PatientView.vue';

const titleList = reactive(ref('Pacientes'));
const patient = reactive(ref([]));
const activePatientList = reactive(ref(true));

const viewPatient = (patientRow) => {
  patient.value = patientRow;
  activePatientList.value = false;
};

provide('titleList', titleList);
provide('viewPatient', viewPatient);
provide('patient', patient);
provide('activePatientList');
</script>
