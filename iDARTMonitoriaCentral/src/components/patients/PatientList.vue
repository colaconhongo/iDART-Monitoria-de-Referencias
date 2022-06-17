<template>
  <q-page class="q-pa-sm q-gutter-sm">
    <PatientSearchFields></PatientSearchFields>
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
import {
  computed,
  inject,
  onMounted,
  reactive,
  ref,
  provide,
  onUpdated,
} from 'vue';
import patientService from 'src/services/patientService/patientService';
import listPatient from 'src/components/Shared/CRUD/TableList.vue';
import PatientSearchFields from 'src/components/patients/PatientSearchFields.vue';
import { useI18n } from 'vue-i18n';
import Patient from 'src/stores/models/patient/patient';
import useUtils from 'src/use/useUtils';
/*
Declarations
*/

const currPatient = reactive(new Patient());
const $q = new useQuasar();
const { t } = useI18n();
const mode = reactive(ref('list'));
const viewPatient = inject('viewPatient');
const title = inject('titleList');
const district = inject('district');
const pharmacy = inject('pharmacy');

const columns = [
  {
    name: 'patientid',
    required: true,
    label: t('patientid'),
    align: 'left',
    field: (row) => row.patientid,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'firstnames',
    align: 'left',
    label: t('firstnames'),
    field: (row) => row.firstnames + ' ' + row.lastname,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'dateofbirth',
    align: 'left',
    label: t('dateofbirth'),
    field: (row) => useUtils.ageCalculator(row.dateofbirth) + ' anos',
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'sex',
    align: 'left',
    label: t('sex'),
    field: (row) => (row.sex === 'F' ? 'Feminino' : 'Masculino'),
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'mainclinic',
    align: 'left',
    label: t('mainclinic'),
    field: (row) => row.mainclinicname,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'clinicname',
    align: 'left',
    label: 'Farmácia de Referência',
    field: (row) => row.clinicname,
    format: (val) => `${val}`,
    sortable: true,
  },
];

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
    getAllPatientsFromAPI(0);
  });

/*
  Computed
*/
const allPatients = computed(() => {
  return patientService.getPatientsByDistrictAndPharmacyFromLocalStorage(
    district,
    pharmacy,
    currPatient
  );
});

/*
  Methods
*/

const getAllPatientsFromAPI = (offset) => {
  if (offset >= 0) {
    patientService.get(offset);
  }
};

provide('allPatients', allPatients);
provide('currPatient', currPatient);
</script>
