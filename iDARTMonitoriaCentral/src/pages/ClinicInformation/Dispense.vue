<template>
  <q-page class="q-pa-sm q-gutter-sm">
    <DispenseHome :is="activeDispenseHome" v-model:title="titleList" />
  </q-page>
</template>
<script setup>
import DispenseHome from 'src/components/dispense/DispenseHome.vue';
import { provide, reactive, ref } from 'vue';

/*
Declarations
*/
const titleList = reactive(ref('Dispensas'));
const titleAddEdit = reactive(ref('Dispensas'));
const show_dialog = reactive(ref(false));
const submitting = reactive(ref(false));
const dispense = reactive(ref([]));
const editedIndex = reactive(ref(0));
const activeDispenseHome = reactive(ref(true));

provide('title', titleAddEdit);
provide('show_dialog', show_dialog);
// provide('clinic', clinic);
provide('submitting', submitting);

/*
  Methods
*/

const close = () => {
  show_dialog.value = false;
  dispense.value = [];
  editedIndex.value = -1;
};
</script>
