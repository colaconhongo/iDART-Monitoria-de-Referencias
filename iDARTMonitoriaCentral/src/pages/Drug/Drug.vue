<template>
  <q-page class="q-pa-sm q-gutter-sm">
    <DrugHome :is="activeDrugHome" v-model:title="titleList" />
    <DrugDetailsVue :is="activeDetails" v-model:title="titleDetails" />
  </q-page>
</template>
<script setup>
import DrugHome from 'src/components/Drug/DrugHome.vue';
import DrugDetailsVue from 'src/components/Drug/DrugDetails.vue';
import { provide, reactive, ref } from 'vue';
import drugService from 'src/services/drugService/drugService';
import { confirm } from 'src/components/Shared/Directives/Plugins/Dialog/dialog';
import { useI18n } from 'vue-i18n';
import formService from 'src/services/formService/formService';

/*
Declarations
*/
const { t } = useI18n();
const titleList = reactive(ref(t('drug')));
const titleAddEdit = reactive(ref(t('drug')));
const titleDetails = reactive(ref(t('drug')));
const show_dialog = reactive(ref(false));
const details_dialog = reactive(ref(false));
const submitting = reactive(ref(false));
const activeEditDialog = reactive(ref(false));
const activeDetails = reactive(ref(false));
const activeDrugHome = reactive(ref(true));
const drug = reactive(ref([]));
const editedIndex = reactive(ref(0));

/*
  Methods
*/
const updateDrug = (drugRow) => {
  const drugname = drugRow.form;
  drugRow.form = formService.getFormByName(drugname)[0].id;
  drugService.patch(drugRow.id, drugRow);
};

const deleteDrug = (drugRow) => {
  drugService
    .delete(drugRow.id)
    .then(() => {
      submitting.value = false;
      close();
    })
    .catch(() => {
      submitting.value = false;
    });
};

const editDrug = (drugRow) => {
  titleAddEdit.value = t('edit').concat(' ').concat(t('drug'));
  drug.value = drugRow;
  activeEditDialog.value = true;
  show_dialog.value = true;
  editedIndex.value = 0;
};

const viewDrug = (drugRow) => {
  titleDetails.value = t('view').concat(' ').concat(t('drug'));
  drug.value = drugRow;
  activeDetails.value = true;
  details_dialog.value = true;
};

const promptToConfirm = (drugRow) => {
  confirm(
    t('confirmation'),
    drugRow.active
      ? 'Deseja Inactivar o '.concat(t('drug')).concat('?')
      : 'Deseja Activar o '.concat(t('drug')).concat('?')
  )
    .onOk(() => {
      if (drugRow.active) {
        drugRow.active = false;
      } else if (!drugRow.active) {
        drugRow.active = true;
      }
      updateDrug(drugRow);
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
  editedIndex.value = -1;
};

provide('title', titleAddEdit);
provide('titleList', titleList);
provide('titleDetails', titleDetails);
provide('show_dialog', show_dialog);
provide('details_dialog', details_dialog);
provide('submitting', submitting);
provide('editDrug', editDrug);
provide('viewDrug', viewDrug);
provide('deleteDrug', deleteDrug);
provide('drug', drug);
provide('close', close);
provide('promptToConfirm', promptToConfirm);
</script>
