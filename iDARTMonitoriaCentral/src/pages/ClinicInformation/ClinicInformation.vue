<template>
  <q-page class="q-pa-sm q-gutter-sm">
    <ClinicInformationHome
      :is="activeClinicInformationHome"
      v-model:title="titleList"
    />
  </q-page>
</template>
<script setup>
import ClinicInformationHome from 'src/components/clinicInformation/ClinicInformationHome.vue';
import { provide, reactive, ref } from 'vue';
import clinicInformationService from 'src/services/clinicInformationService/clinicInformationService';

/*
Declarations
*/
const titleList = reactive(ref('Atenção Farmacêutica'));
const titleAddEdit = reactive(ref('Farmácia'));
const titleDetails = reactive(ref('Detalhes da Farmácia'));
const show_dialog = reactive(ref(false));
const submitting = reactive(ref(false));
const clinicInformation = reactive(ref([]));
const editedIndex = reactive(ref(0));
const activeClinicInformationHome = reactive(ref(true));

provide('title', titleAddEdit);
provide('show_dialog', show_dialog);
// provide('clinic', clinic);
provide('submitting', submitting);

/*
  Methods
*/

const close = () => {
  show_dialog.value = false;
  clinicInformation.value = [];
  editedIndex.value = -1;
};
</script>
