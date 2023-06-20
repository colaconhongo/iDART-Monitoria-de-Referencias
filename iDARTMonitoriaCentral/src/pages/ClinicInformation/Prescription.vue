<template>
  <q-page class="q-pa-sm q-gutter-sm">
    <PrescriptionHome :is="activePrescriptionHome" />
  </q-page>
</template>
<script setup>
import PrescriptionHome from 'src/components/prescription/PrescriptionHome.vue';
import { provide, reactive, ref } from 'vue';
import prescriptionService from 'src/services/prescriptionService/prescriptionService';

/*
Declarations
*/
const titleAddEdit = ref('Prescrições');
const show_dialog = reactive(ref(false));
const submitting = reactive(ref(false));
const prescription = reactive(ref([]));
const editedIndex = reactive(ref(0));
const activePrescriptionHome = reactive(ref(true));

provide('title', titleAddEdit);
provide('show_dialog', show_dialog);
// provide('clinic', clinic);
provide('submitting', submitting);

/*
  Methods
*/

const close = () => {
  show_dialog.value = false;
  editedIndex.value = -1;
};
</script>
