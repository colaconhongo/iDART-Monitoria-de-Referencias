<template>
  <q-page class="q-pa-sm q-gutter-sm">
    <RegimenHome :is="activeRegimenHome" v-model:title="titleList" />
    <RegimenDetailsVue :is="activeDetails" v-model:title="titleDetails" />
  </q-page>
</template>
<script setup>
import RegimenHome from 'src/components/Regimen/RegimenHome.vue';
import RegimenDetailsVue from 'src/components/Regimen/RegimenDetails.vue';
import { provide, reactive, ref } from 'vue';
import regimenService from 'src/services/regimenService/regimenService';
import { confirm } from 'src/components/Shared/Directives/Plugins/Dialog/dialog';
import { useI18n } from 'vue-i18n';

/*
Declarations
*/
const { t } = useI18n();
const titleList = reactive(ref(t('regimen')));
const titleAddEdit = reactive(ref(t('regimen')));
const titleDetails = reactive(ref(t('regimen')));
const show_dialog = reactive(ref(false));
const details_dialog = reactive(ref(false));
const submitting = reactive(ref(false));
const activeEditDialog = reactive(ref(false));
const activeDetails = reactive(ref(false));
const activeRegimenHome = reactive(ref(true));
const regimen = reactive(ref([]));
const editedIndex = reactive(ref(0));

/*
  Methods
*/
const updateRegimen = (regimenRow) => {
  regimenService.patch(regimenRow.regimeid, regimenRow);
};

const deleteRegimen = (regimenRow) => {
  regimenService
    .delete(regimenRow.id)
    .then(() => {
      submitting.value = false;
      close();
    })
    .catch(() => {
      submitting.value = false;
    });
};

const editRegimen = (regimenRow) => {
  titleAddEdit.value = t('edit').concat(' ').concat(t('regimen'));
  regimen.value = regimenRow;
  activeEditDialog.value = true;
  show_dialog.value = true;
  editedIndex.value = 0;
};

const viewRegimen = (regimenRow) => {
  titleDetails.value = t('view').concat(' ').concat(t('regimen'));
  regimen.value = regimenRow;
  activeDetails.value = true;
  details_dialog.value = true;
};

const promptToConfirm = (regimenRow) => {
  confirm(
    t('confirmation'),
    regimenRow.active
      ? 'Deseja Inactivar o '.concat(t('regimen')).concat('?')
      : 'Deseja Activar o '.concat(t('regimen')).concat('?')
  )
    .onOk(() => {
      if (regimenRow.active) {
        regimenRow.active = false;
      } else if (!regimenRow.active) {
        regimenRow.active = true;
      }
      updateRegimen(regimenRow);
    })
    .onCancel(() => {
      close();
    })
    .onDismiss(() => {
      close();
    });
};

const close = () => {
  activeDetails.value = false;
  show_dialog.value = false;
  details_dialog.value = false;
  activeEditDialog.value = false;
  regimen.value = [];
  editedIndex.value = -1;
};

provide('title', titleAddEdit);
provide('titleList', titleList);
provide('titleDetails', titleDetails);
provide('show_dialog', show_dialog);
provide('details_dialog', details_dialog);
provide('submitting', submitting);
provide('editRegimen', editRegimen);
provide('viewRegimen', viewRegimen);
provide('deleteRegimen', deleteRegimen);
provide('regimen', regimen);
provide('close', close);
provide('promptToConfirm', promptToConfirm);
</script>
