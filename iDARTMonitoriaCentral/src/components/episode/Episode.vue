<template>
  <q-page class="q-pa-sm q-gutter-sm">
    <episodeHome v-model:title="titleList" />
  </q-page>
</template>
<script setup>
import { provide, reactive, ref } from 'vue';
import episodeHome from 'src/components/episode/episodeHome.vue';

/*
  Declarations
*/
const titleList = reactive(ref('Epsódios'));
const show_dialog = reactive(ref(false));
const episode = reactive(ref([]));
const activeEditDialog = reactive(ref(false));
const editedIndex = reactive(ref(0));
const titleAddEdit = reactive(ref('Epsódio'));

const editEpisode = (episodeRow) => {
  titleAddEdit.value = 'Actualizar Epsódio';
  episode.value = episodeRow;
  activeEditDialog.value = true;
  show_dialog.value = true;
  editedIndex.value = 0;
};

const close = () => {
  activeDetails.value = false;
  show_dialog.value = false;
  // details_dialog.value = false;
  activeEditDialog.value = false;
  episode.value = [];
  editedIndex.value = -1;
};
// const activeClinicHome = reactive(ref(true));

// onMounted(() => {
//   $q.loading.show({
//     message: 'Carregando ...',
//     spinnerColor: 'grey-4',
//     spinner: QSpinnerBall,
//   });
//   setTimeout(() => {
//     $q.loading.hide();
//   }, 600);
//   alert(patient.uuidopenmrs);
//   // getPatientEpisodesFromAPI(patient.uuidopenmrs);
//   getPatientEpisodesFromAPI();
// });

// const getPatientEpisodesFromAPI = (offset) => {
//   // episodeService.getById(id);
//   episodeService.get();
//   console.log('999999999999999999999999999999999999999');
// };

provide('editEpisode', editEpisode);
provide('close', close);
provide('title', titleAddEdit);
</script>
