<template>
  <q-page class="q-pa-sm q-gutter-sm">
    <ViewClinic
      v-model:title="titleDetails"
      v-model:details_dialog="details_dialog"
      v-model:entity="clinic"
      v-model:excludeAttribute="excludeAttribute"
      v-model:close="close"
    />
  </q-page>
</template>
<script setup>
import ViewClinic from 'src/components/Shared/CRUD/ModalDetails.vue';
import { inject, ref } from 'vue';

/*
  Injection
*/

const details_dialog = inject('details_dialog');
const titleDetails = inject('titleDetails');
const clinic = inject('clinic');
const close = inject('close');
const excludeAttribute = ref(['id', 'uuid', 'clinicdetails_id', 'subdistrict']);
</script>
