<template>
  <q-page class="q-pa-sm q-gutter-sm">
    <clinicHome :is="activeClinicHome" v-model:title="titleList" />
    <ClinicDetailsVue :is="activeDetails" />
    <CreateEditClinic
      :is="true"
      v-model:createOrUpdate="createOrUpdate"
      v-model:close="close"
      v-model:clinic="clinic"
      v-model:getAllProvincia="getAllProvincia"
    />
    <div class="absolute-bottom">
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn
          size="xl"
          fab
          icon="add"
          @click="createClinic()"
          color="primary"
        />
      </q-page-sticky>
    </div>
  </q-page>
</template>
<script setup>
import ClinicHome from 'src/components/Clinic/ClinicHome.vue';
import ClinicDetailsVue from 'src/components/Clinic/ClinicDetails.vue';
import CreateEditClinic from 'src/components/Clinic/ClinicCreateEditModal.vue';
import { provide, reactive, ref } from 'vue';
import clinicService from 'src/services/clinicService/clinicService';

/*
Declarations
*/
const titleList = reactive(ref('Farmácia'));
const titleAddEdit = reactive(ref('Farmácia'));
const titleDetails = reactive(ref('Detalhes da Farmácia'));
const show_dialog = reactive(ref(false));
const submitting = reactive(ref(false));
const activeEditDialog = reactive(ref(false));
const activeDetails = reactive(ref(false));
const activeClinicHome = reactive(ref(true));
const clinic = reactive(ref([]));
const editedIndex = reactive(ref(0));

provide('title', titleAddEdit);
provide('show_dialog', show_dialog);
// provide('clinic', clinic);
provide('submitting', submitting);

/*
  Methods
*/
const createClinic = () => {
  titleAddEdit.value = 'Adicionar Farmácia';
  clinic.value = reactive(clinicService.newInstanceEntity());
  activeEditDialog.value = true;
  show_dialog.value = true;
  editedIndex.value = 1;
};

const editClinic = (clinic) => {
  titleAddEdit.value = 'Actualizar Farmácia';
  clinic.value = clinic;
  activeEditDialog.value = true;
  show_dialog.value = true;
  editedIndex.value = 1;
};

const createOrUpdate = () => {
  submitting.value = true;
  console.log(clinic);
  if (editedIndex.value != 1) {
    clinicService.patch(clinic.value.id, clinic).then(() => {
      submitting.value = false;
    });
  } else {
    delete clinic.value['id'];
    clinicService.post(clinic.value).then(() => {
      submitting.value = false;
    });
  }
};

const close = () => {
  show_dialog.value = false;
  clinic.value = [];
  editedIndex.value = -1;
};
</script>
