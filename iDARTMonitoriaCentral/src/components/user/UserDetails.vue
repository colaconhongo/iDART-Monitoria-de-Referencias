<template>
  <q-page class="q-pa-sm q-gutter-sm">
    {{ user }}
    <ViewUser
      v-model:title="titleDetails"
      v-model:details_dialog="details_dialog"
      v-model:entity="localEntity"
      v-model:excludeAttribute="excludeAttribute"
      v-model:close="close"
    />
  </q-page>
</template>
<script setup>
import ViewUser from 'src/components/Shared/CRUD/ModalDetails.vue';
import { inject, ref } from 'vue';

/*
  Injection
*/

const details_dialog = inject('details_dialog');
const titleDetails = inject('titleDetails');
const localEntity = inject('localEntity');
const close = inject('close');
const excludeAttribute = ref(['id', 'userid', 'pass']);

/*
  Mounted Hooks
*/
</script>
