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
import { provide, reactive, ref } from 'vue';
import episodeHome from 'src/components/episode/episodeHome.vue';
import EpisodeEditModal from 'src/components/episode/EpisodeEditModal.vue';
import episodeService from 'src/services/episodeService/episodeService';

/*
  Declarations
*/
const titleList = reactive(ref('Epsódios'));
const show_dialog = reactive(ref(false));
const episode = reactive(ref([]));
const activeEditDialog = reactive(ref(false));
const titleAddEdit = reactive(ref('Epsódio'));
const activeEpisodeHome = reactive(ref(true));
const submitting = reactive(ref(false));

const editEpisode = (episodeRow) => {
  titleAddEdit.value = 'Actualizar Epsódio';
  episode.value = episodeRow;
  activeEditDialog.value = true;
  show_dialog.value = true;
};

const update = () => {
  submitting.value = true;

  episodeService
    .patch(episode.value.id, episode.value)
    .then(() => {
      submitting.value = false;
      close();
    })
    .catch(() => {
      submitting.value = false;
    });
};

const close = () => {
  show_dialog.value = false;
  activeEditDialog.value = false;
  episode.value = [];
};

provide('editEpisode', editEpisode);
provide('close', close);
provide('title', titleAddEdit);
provide('episode', episode);
provide('show_dialog', show_dialog);
provide('submitting', submitting);
</script>
