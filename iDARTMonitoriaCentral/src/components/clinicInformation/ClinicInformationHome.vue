<template>
  <q-page class="q-pa-sm q-gutter-sm">
    <listClinic
      :columns="columns"
      :mode="mode"
      :with_downloadButton="true"
      :rows="allClinicInformation"
      :title="props.title"
      :with_actionRemoveButton="false"
      :with_actionEditButton="false"
      :with_actionDetailButton="true"
      :visualizar="visualizar"
    />
    <clinicInformationModal
      :is="true"
      :show_dialog="show_dialog"
      :clinicInformation="clinicInformation"
    />
  </q-page>
</template>
<script setup>
import { useQuasar, QSpinnerBall } from 'quasar';
import clinicInformationService from 'src/services/clinicInformationService/clinicInformationService';
import { computed, onMounted, reactive, ref, inject } from 'vue';
import listClinic from 'src/components/Shared/CRUD/TableList.vue';
import clinicInformationModal from 'src/components/clinicInformation/ClinicInformationDetailsModal.vue';
import moment from 'moment';

/*
Props
*/

const props = defineProps({
  title: {
    type: String,
  },
});

/*
Declarations
*/
const $q = new useQuasar();
const mode = reactive(ref('list'));
const clinicInformation = reactive(ref({}));

const show_dialog = reactive(ref(false));
const editedIndex = reactive(ref(0));
const patient = inject('patient')

const columns = [
  {
    name: 'registerdate',
    required: true,
    label: 'Data de Registo',
    align: 'left',
    field: (row) => moment(row.registerdate).format('DD-MM-YYYY'),
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'weight',
    align: 'left',
    label: 'Peso (Kg)',
    field: (row) => row.weight,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'height',
    align: 'left',
    label: 'Altura (Cm)',
    field: (row) => row.height,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'imc',
    align: 'left',
    label: 'IMC',
    field: (row) => row.imc ===null? '-':row.imc,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'systole',
    align: 'left',
    label: 'Sistole (mmHg)',
    field: (row) => row.systole,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'distort',
    align: 'left',
    label: 'Diastole (mmHg)',
    field: (row) => row.distort,
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
  getAllClinicInformationFromAPI(0);
});

/*
  Computed
*/

const allClinicInformation = computed(() => {
  return clinicInformationService.getClinicInformationByPatientUuid(
   '40b17748-05d6-44db-9d44-581f4853c854'
  );
  // getClinicInformationByPatientUuid
  //
  // patient.uuidopenmrs
});

/*
  Methods
*/

const getAllClinicInformationFromAPI = (offset) => {
  if (offset >= 0) {
    clinicInformationService.get(offset);
  }
};

const visualizar = (clinicInformationEntity) => {
  show_dialog.value = true;
  editedIndex.value = 1;
  clinicInformation.value = clinicInformationEntity;
};
</script>
