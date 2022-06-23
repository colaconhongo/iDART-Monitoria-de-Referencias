<template>
  <q-page class="q-pa-sm q-gutter-sm">
    <episodeHome :is="activeEpisodeHome" v-model:title="titleList" />
    <EpisodeEditModal v-if="editEpisode" />
  </q-page>
</template>
<script setup>
import { provide, reactive, ref, inject } from 'vue';
import episodeHome from 'src/components/episode/episodeHome.vue';
import EpisodeEditModal from 'src/components/episode/EpisodeEditModal.vue';
import patientService from 'src/services/patientService/patientService.ts';
import episodeService from 'src/services/episodeService/episodeService.ts';
import moment from 'moment';

/*
  Declarations
*/
const titleList = reactive(ref('Episódios'));
const show_dialog = reactive(ref(false));
const episode = reactive(ref([]));
const episodeStop = ref([]);
const activeEditDialog = reactive(ref(false));
const titleAddEdit = reactive(ref('Episódio'));
const titleEpisodeList = reactive(ref('Episódios'));
const activeEpisodeHome = reactive(ref(true));
const submitting = reactive(ref(false));
const patientAux = reactive(ref([]));
const clinicBeforeUpdate = reactive(ref(''));

const patient = inject('patient');
const activePatientList = inject('activePatientList');

const editEpisode = (episodeRow) => {
  titleAddEdit.value = 'Actualizar Episódio';
  episode.value = episodeRow;
  episode.value.startdate = episodeRow.startdate;
  clinicBeforeUpdate.value = episodeRow.clinic;
  episodeStop.value = episodeService.newInstanceEntity();
  activeEditDialog.value = true;
  show_dialog.value = true;
};

const update = () => {
  if (episode.value.stopdate == null) {
    submitting.value = true;
    patientAux.value.mainclinicname = patient.value.mainclinicname;
    patientAux.value.clinicname = episode.value.clinic.clinicname;
    patientAux.value.id = episode.value.id;
    patientAux.value.clinicuuid = episode.value.clinic.uuid;
    patientAux.value.clinic = episode.value.clinic.id;
    patientAux.value.modified = 'T';

    //Episodio de Fim na Farmacia anterior
    episodeStop.value.clinic = clinicBeforeUpdate.value;
    episodeStop.value.stopdate = moment(new Date());
    episodeStop.value.stopnotes = 'Paciente enviado para outra Farmácia';
    episodeStop.value.stopreason = 'Contra Referido para outra Farmácia';
    episodeStop.value.syncstatus = 'R';
    episodeStop.value.patientuuid = episode.value.patientuuid;
    episodeStop.value.startdate =
      episode.value.startdate === null || episode.value.startdate === undefined
        ? moment(new Date())
        : episode.value.startdate;
    episodeStop.value.usuuid = episode.value.usuuid;
    episodeStop.value.clinicuuid = episode.value.clinicuuid;
    episodeStop.value.startnotes = episode.value.startnotes;

    removeAttributes(episodeStop.value);

    patientService
      .patch(episode.value.id, Object.assign({}, patientAux.value))
      .then((resp) => {
        saveStopEpisode(episodeStop.value);
        submitting.value = false;
        close();
        episodeService.getById(patient.value.uuidopenmrs);
      })
      .catch(() => {
        submitting.value = false;
      });
  } else {
    // alert('Episodio de fim');
  }
};

const saveStopEpisode = (episode) => {
  episodeService.post(episode).catch(() => {
    submitting.value = false;
  });
  episodeService.getById(patient.value.uuidopenmrs);
};

const removeAttributes = (objectEntity) => {
  ['clinic', 'us', 'id'].forEach((attibute) => {
    delete objectEntity[attibute];
  });
  return objectEntity;
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
provide('update', update);
provide('close', close);
provide('episode', episode);
</script>
