<template>
  <q-page class="q-pa-sm q-gutter-sm">
    <PatientSearchFields />
    <listPatient
      :columns="columns"
      :mode="mode"
      :rows="allPatients"
      :title="title"
      :visualizar="viewPatient"
      :with_actionsButton="true"
      :with_actionDetailButton="true"
      :with_downloadButton="false"
      :with_actionRemoveButton="false"
      :with_actionEditButton="false"
    />
  </q-page>
</template>
<script setup>
import { useQuasar, QSpinnerBall } from 'quasar';
import { computed, inject, onMounted, reactive, ref } from 'vue';
import patientService from 'src/services/patientService/patientService';
import listPatient from 'src/components/Shared/CRUD/TableList.vue';
// import PatientSearchFields from 'src/pages/patients/PatientSearchFields.vue';
import { useI18n } from 'vue-i18n';

/*
Declarations
*/

const $q = new useQuasar();
const { t } = useI18n();
const mode = reactive(ref('list'));
const viewPatient = inject('viewPatient');
const title = inject('titleList');
const activePatientList = inject('activePatientList');

const columns = [
  {
    name: 'uuidopenmrs',
    required: true,
    label: t('NID'),
    align: 'left',
    field: (row) => row.uuidopenmrs,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'firstnames',
    align: 'left',
    label: t('Nome do Paciente'),
    field: (row) =>
      row.firstnames + ' ' + row.lastname + '\r' + row.dateofbirth,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'sex',
    align: 'left',
    label: t('Sexo'),
    field: (row) => row.sex,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'mainclinic',
    align: 'left',
    label: t('Unidade Sanitária'),
    field: (row) => row.mainclinic,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'clinicname',
    align: 'left',
    label: t('Framácia  de Referência'),
    field: (row) => row.clinicname,
    format: (val) => `${val}`,
    sortable: true,
  },
];

/*
  Mounted Hooks
*/
onMounted(() => {
  $q.loading.show({
    message: 'Carregando ...',
    spinnerColor: 'grey-4',
    spinner: QSpinnerBall,
  });
  setTimeout(() => {
    $q.loading.hide();
  }, 600);
  getAllPatientsFromAPI(0);
});

/*
  Computed
*/
const allPatients = computed(() => {
  return patientService.getAllFromStorage();
});

/*
  Methods
*/

const getAllPatientsFromAPI = (offset) => {
  if (offset >= 0) {
    patientService.get(offset);
  }
};
</script>
