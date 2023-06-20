<template>
  <q-page class="q-pa-sm q-gutter-sm">
    <listClinic
      :columns="columns"
      :with_downloadButton="true"
      :rows="allPrescription"
      :title="title"
      :with_actionRemoveButton="false"
      :with_actionEditButton="false"
      :with_actionDetailButton="false"
    />
  </q-page>
</template>
<script setup>
import prescriptionService from 'src/services/prescriptionService/prescriptionService';
import { computed, inject, onMounted } from 'vue';
import listClinic from 'src/components/Shared/CRUD/TableListStatus.vue';
import moment from 'moment';

/*
Props
*/

/*
Declarations
*/
const patient = inject('patient');
const title = inject('title');
const columns = [
  {
    name: 'pickupdate',
    required: true,
    label: 'Data de levantamento',
    align: 'left',
    field: (row) => moment(row.pickupdate).format('DD-MM-YYYY'),
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'drugname',
    align: 'left',
    label: 'Medicamento',
    field: (row) => row.drugname,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'qtyinhand',
    align: 'left',
    label: 'Quantidade',
    field: (row) =>
      parseInt(row.qtyinhand.match(/\(([^)]+)\)/)[1]) < 10
        ? parseInt(row.qtyinhand.match(/\(([^)]+)\)/)[1]) + ' Frasco(s)'
        : parseInt(row.qtyinhand.match(/\(([^)]+)\)/)[1]) + ' Comprimidos',
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'duration',
    align: 'left',
    label: 'Duração',
    field: (row) =>
      row.duration !== null
        ? row.duration / 4 < 1
          ? row.duration + ' Semana(s)'
          : row.duration / 4 + ' Mes(es)'
        : 0,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'dateexpectedstring',
    align: 'left',
    label: 'Data próximo levantamento',
    field: (row) => moment(row.dateexpectedstring).format('DD-MM-YYYY'),
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'syncstatus',
    align: 'left',
    label: 'Estado',
    field: (row) => row.syncstatus,
    format: (val) => `${val}`,
    sortable: true,
  },
];
/*
  Mounted Hooks
*/
onMounted(() => {
  getAllPrescriptionFromAPI(0);
});

/*
  Computed
*/

const allPrescription = computed(() => {
  return prescriptionService.getPrescriptionsByPatientId(
    patient.value.patientid
  );
});

/*
  Methods
*/

const getAllPrescriptionFromAPI = (offset) => {
  if (offset >= 0) {
    prescriptionService.getByPatientID(patient.value.patientid, offset);
  }
};
</script>
