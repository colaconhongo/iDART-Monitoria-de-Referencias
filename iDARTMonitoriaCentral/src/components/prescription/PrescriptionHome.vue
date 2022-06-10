<template>
  <q-page class="q-pa-sm q-gutter-sm">
    <listClinic
      :columns="columns"
      :mode="mode"
      :with_downloadButton="true"
      :rows="allPrescription"
      :title="props.title"
      :with_actionRemoveButton="false"
      :with_actionEditButton="false"
      :with_actionDetailButton="true"
      :visualizar="visualizar"
    />
    <prescriptionDetailsModal
      :is="true"
      :prescription="prescription"
      :patient="patient"
    />
  </q-page>
</template>
<script setup>
import { useQuasar, QSpinnerBall } from 'quasar';
import prescriptionService from 'src/services/prescriptionService/prescriptionService';
import { computed, onMounted, provide, reactive, inject, ref } from 'vue';
import listClinic from 'src/components/Shared/CRUD/TableList.vue';
import prescriptionDetailsModal from 'src/components/prescription/PrescriptionDetailsModal.vue';
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
const prescription = ref({});
const show_dialog = reactive(ref(false));

provide('show_dialog', show_dialog);
const editedIndex = reactive(ref(0));
const patient = inject('patient');

const columns = [
  {
    name: 'date',
    required: true,
    label: 'Data de Registo',
    align: 'left',
    field: (row) => moment(row.date).format('DD-MM-YYYY'),
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'durationsentence',
    align: 'left',
    label: 'Duração',
    field: (row) => row.durationsentence,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'regimenome',
    align: 'left',
    label: 'Regime',
    field: (row) => row.regimenome,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'linhanome',
    align: 'left',
    label: 'Linha',
    field: (row) => row.linhanome,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'prescricaoespecial',
    align: 'left',
    label: 'Especial',
    field: (row) => (row.prescricaoespecial === 'F' ? 'Não' : 'Sim'),
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'motivocriacaoespecial',
    align: 'left',
    label: 'Motivo',
    field: (row) => row.motivocriacaoespecial,
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
  getAllPrescriptionFromAPI(0);
});

/*
  Computed
*/

const allPrescription = computed(() => {
  const dispensesAndPrescriptions =
    prescriptionService.getPrescriptionsByPatientId('patient.value.patientid');
  //'04010001/16/0268
  //

  let prescriptions = [
    ...new Map(
      dispensesAndPrescriptions.map((item) => [item['prescriptionid'], item])
    ).values(),
  ];
  return prescriptions;
});

/*
  Methods
*/

const getAllPrescriptionFromAPI = (offset) => {
  if (offset >= 0) {
    prescriptionService.get(offset);
  }
};

const visualizar = (prescriptionEntity) => {
  show_dialog.value = true;
  editedIndex.value = 1;
  prescription.value = prescriptionEntity;
};
</script>
