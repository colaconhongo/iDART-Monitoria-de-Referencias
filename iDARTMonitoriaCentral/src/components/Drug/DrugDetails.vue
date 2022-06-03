<template>
  <q-page class="q-pa-sm q-gutter-sm">
    <ViewDrug
      v-model:title="titleDetails"
      v-model:details_dialog="details_dialog"
      v-model:entity="drug"
      v-model:excludeAttribute="excludeAttribute"
      v-model:close="close"
    />
  </q-page>
</template>
<script setup>
import ViewDrug from 'src/components/Shared/CRUD/ModalDetails.vue';
import { inject, ref } from 'vue';

/*
  Injection
*/

const details_dialog = inject('details_dialog');
const titleDetails = inject('titleDetails');
const drug = inject('drug');
const close = inject('close');
const excludeAttribute = ref([
  'id',
  'pediatric',
  'stockcode',
  'sidetreatment',
  'modified',
]);
</script>
