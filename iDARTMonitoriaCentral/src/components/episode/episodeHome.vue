<template>
  <q-page class="q-pa-sm q-gutter-sm">
    <listEpisode
      :columns="columns"
      :mode="mode"
      :rows="allEpisodes"
      :title="title"
      :editar="editEpisode"
      :with_actionsButton="true"
      :with_actionDetailButton="false"
      :with_downloadButton="false"
      :with_actionRemoveButton="false"
      :with_actionEditButton="true"
    />
  </q-page>
</template>
<script setup>
import { useQuasar, QSpinnerBall } from 'quasar';
import episodeService from 'src/services/episodeService/episodeService';
import { provide, inject, computed, onMounted, reactive, ref } from 'vue';
import listEpisode from 'src/components/Shared/CRUD/TableList.vue';
import moment from 'moment';
//import CreateEditEpisode from 'src/components/episode/EpisodeCreateEditModal.vue';

/*
Declarations
*/
const $q = new useQuasar();
const mode = reactive(ref('list'));
const patient = inject('patient');
const editEpisode = inject('editEpisode');
const title = inject('titleEpisode');

const columns = [
  {
    name: 'startdate',
    required: true,
    label: 'Data de Epsódio',
    align: 'left',
    field: (row) => moment(row.startdate).format('DD-MM-YYYY'),
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'startreason',
    align: 'left',
    label: 'Motivo',
    field: (row) => row.startreason,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'startnotes',
    align: 'left',
    label: 'Nota',
    field: (row) => row.startnotes,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'us',
    align: 'left',
    label: 'Unidade Sanitária',
    field: (row) => row.us,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'clinic',
    align: 'left',
    label: 'Framácia de Referência',
    field: (row) => row.clinic,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'syncstatus',
    align: 'left',
    label: 'Estado',
    field: (row) =>
      row.syncstatus == 'S' || row.syncstatus == 'U' ? 'Enviado' : 'Pendente',
    format: (val) => `${val}`,
    sortable: true,
  },
];
/*
  Mounted Hooks
*/
// onMounted(() => {
//   $q.loading.show({
//     message: 'Carregando ...',
//     spinnerColor: 'grey-4',
//     spinner: QSpinnerBall,
//   });
//   setTimeout(() => {
//     $q.loading.hide();
//   }, 600);
//   // getAllClinicFromAPI(0);
//   alert(patient.uuidopenmrs);
//   getPatientEpisodesFromAPI(patient.uuidopenmrs);
// });

onMounted(() => {
  $q.loading.show({
    message: 'Carregando ...',
    spinnerColor: 'grey-4',
    spinner: QSpinnerBall,
  });
  setTimeout(() => {
    $q.loading.hide();
  }, 600);

  // getPatientEpisodesFromAPI(patient.uuidopenmrs);
  getPatientEpisodesFromAPI(patient.value.uuidopenmrs);
});

/*
  Computed
*/
const allEpisodes = computed(() => {
  return episodeService.getAllFromStorage();
});

/*
  Methods
*/

// const getAllClinicFromAPI = (offset) => {
//   if (offset >= 0) {
//     clinicService.get(offset);
//   }
// };

const getPatientEpisodesFromAPI = (nid) => {
  // episodeService.getById(id);
  return episodeService.getById(nid);
};
</script>
