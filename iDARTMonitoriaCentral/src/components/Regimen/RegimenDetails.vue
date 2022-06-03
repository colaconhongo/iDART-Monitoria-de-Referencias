<template>
  <q-page class="q-pa-sm q-gutter-sm">
    <ViewRegimen
      v-model:title="titleDetails"
      v-model:details_dialog="details_dialog"
      v-model:entity="regimen"
      v-model:excludeAttribute="excludeAttribute"
      v-model:close="close"
    />
  </q-page>
</template>
<script setup>
import ViewRegimen from 'src/components/Shared/CRUD/ModalDetails.vue';
import { inject, ref } from 'vue';

/*
  Injection
*/

const details_dialog = inject('details_dialog');
const titleDetails = inject('titleDetails');
const regimen = inject('regimen');
const close = inject('close');
const excludeAttribute = ref([
  'regimeid',
  'regimenomeespecificado',
  'regimeesquemaidart',
]);
</script>
