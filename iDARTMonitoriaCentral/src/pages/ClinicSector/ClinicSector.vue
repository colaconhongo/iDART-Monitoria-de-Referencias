<template>
  <q-page class="q-pa-sm q-gutter-sm">
    <clinicSectorHome :is="activeClinicSectorHome" v-model:title="titleList" />
    <ClinicSectorDetailsVue :is="activeDetails" v-model:title="titleDetails" />
  </q-page>
</template>
<script setup>
import ClinicSectorHome from 'src/components/ClinicSector/ClinicSectorHome.vue';
import ClinicSectorDetailsVue from 'src/components/ClinicSector/ClinicSectorDetails.vue';
import { provide, reactive, ref } from 'vue';
import clinicSectorService from 'src/services/clinicSectorService/clinicSectorService';
import { useI18n } from 'vue-i18n';
import clinicService from 'src/services/clinicService/clinicService';

/*
Declarations
*/
const { t } = useI18n();
const titleList = reactive(ref(t('clinicSector')));
const titleAddEdit = reactive(ref(t('clinicSector')));
const titleDetails = reactive(ref(t('clinicSector')));
const show_dialog = reactive(ref(false));
const details_dialog = reactive(ref(false));
const submitting = reactive(ref(false));
const activeEditDialog = reactive(ref(false));
const activeDetails = reactive(ref(false));
const activeClinicSectorHome = reactive(ref(true));
const clinicSector = reactive(ref([]));
const editedIndex = reactive(ref(0));

/*
  Methods
*/

const deleteClinicSector = (clinicSectorRow) => {
  clinicSectorService
    .delete(clinicSectorRow.id)
    .then(() => {
      submitting.value = false;
      close();
    })
    .catch(() => {
      submitting.value = false;
    });
};

const editClinicSector = (clinicSectorRow) => {
  titleAddEdit.value = t('edit').concat(' ').concat(t('clinicSector'));
  clinicSector.value = clinicSectorRow;
  activeEditDialog.value = true;
  show_dialog.value = true;
  editedIndex.value = 0;
};

const viewClinicSector = (clinicSectorRow) => {
  titleDetails.value = t('view').concat(' ').concat(t('clinicSector'));
  clinicSector.value = clinicSectorRow;
  clinicSector.value.clinic = clinicService.getClinicByID(
    clinicSector.value.clinicuuid
  )[0].clinicname;
  clinicSector.value.clinicsectortype =
    clinicSector.value.clinicsectortypee.description;
  activeDetails.value = true;
  details_dialog.value = true;
};

const close = () => {
  activeDetails.value = false;
  show_dialog.value = false;
  details_dialog.value = false;
  activeEditDialog.value = false;
  clinicSector.value = [];
  editedIndex.value = -1;
};

provide('title', titleAddEdit);
provide('titleList', titleList);
provide('titleDetails', titleDetails);
provide('show_dialog', show_dialog);
provide('details_dialog', details_dialog);
provide('submitting', submitting);
provide('editClinicSector', editClinicSector);
provide('viewClinicSector', viewClinicSector);
provide('deleteClinicSector', deleteClinicSector);
provide('clinicSector', clinicSector);
provide('close', close);
</script>
