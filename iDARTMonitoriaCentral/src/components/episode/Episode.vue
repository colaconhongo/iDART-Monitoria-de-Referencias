<template>
  <q-page class="q-pa-sm q-gutter-sm">
    <episodeHome :is="activeEpisodeHome" v-model:title="titleList" />
    <EpisodeEditModal
      v-if="editEpisode"
      v-model:update="update"
      v-model:close="close"
      v-model:episode="episode"
    />
  </q-page>
</template>
<script setup>
import { provide, reactive, ref, inject } from 'vue';
import episodeHome from 'src/components/episode/episodeHome.vue';
import EpisodeEditModal from 'src/components/episode/EpisodeEditModal.vue';
import patientService from 'src/services/patientService/patientService.ts';
import episodeService from 'src/services/episodeService/episodeService.ts';

/*
  Declarations
*/
const titleList = reactive(ref('Epsódios'));
const show_dialog = reactive(ref(false));
const episode = reactive(ref([]));
const episodeStop = reactive(ref([]));
const activeEditDialog = reactive(ref(false));
const titleAddEdit = reactive(ref('Epsódio'));
const titleEpisodeList = reactive(ref('Epsódios'));
const activeEpisodeHome = reactive(ref(true));
const submitting = reactive(ref(false));
const patientAux = reactive(ref([]));
const cliniBeforeUpdate = reactive(ref(''));

const patient = inject('patient');

const editEpisode = (episodeRow) => {
  titleAddEdit.value = 'Actualizar Epsódio';
  episode.value = episodeRow;
  cliniBeforeUpdate.value = episodeRow.clinic;
  episodeStop.value = episodeRow;
  activeEditDialog.value = true;
  show_dialog.value = true;
};

const update = () => {
  // clinicForUpdate = clinicService.getClinicByName(clinicnameBeforeUpdate.value);
  // alert(clinicForUpdate.value.id);
  console.log(patient.value.uuidopenmrs);
  if (episode.value.stopdate == null) {
    submitting.value = true;
    patientAux.value.mainclinicname = patient.value.mainclinicname;
    patientAux.value.clinicname = episode.value.clinic.clinicname;
    patientAux.value.id = episode.value.id;
    patientAux.value.clinicuuid = episode.value.clinic.uuid;
    episodeStop.value.clinic = console.log('new: ', episodeStop.value);
    console.log('clinic: ', cliniBeforeUpdate.value);

    patientService
      .patch(episode.value.id, Object.assign({}, patientAux.value))
      .then(() => {
        submitting.value = false;
        episodeService.getById(patient.value.uuidopenmrs);
        close();
      })
      .catch(() => {
        submitting.value = false;
      });
  } else {
    alert('Episodio de fim');
  }

  // submitting.value = true;
  // console.log('VIVA: ', episode.value);
  // close();

  // // episodeService
  // //   .patch(episode.value.id, episode.value)
  // //   .then(() => {
  // //     submitting.value = false;
  // //     close();
  // //   })
  // //   .catch(() => {
  // //     submitting.value = false;
  // //   });
};

const close = () => {
  show_dialog.value = false;
  activeEditDialog.value = false;
  episode.value = [];
};

provide('editEpisode', editEpisode);
provide('close', close);
provide('titleEdit', titleAddEdit);
provide('titleEpisode', titleEpisodeList);
provide('episode', episode);
provide('show_dialog', show_dialog);
provide('submitting', submitting);
</script>
