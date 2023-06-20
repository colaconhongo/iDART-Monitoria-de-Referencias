<template>
  <q-page class="q-pa-sm q-gutter-sm">
    <listDrug
      :columns="columns"
      :mode="mode"
      :with_downloadButton="true"
      :with_activeButton="true"
      :with_actionDetailButton="true"
      :with_actionEditButton="false"
      :with_actionRemoveButton="false"
      :rows="allDrugs"
      :title="title"
      :visualizar="viewDrug"
      :editar="editDrug"
      :remover="deleteDrug"
      :promptToConfirm="promptToConfirm"
    />
  </q-page>
</template>
<script setup>
import drugService from 'src/services/drugService/drugService';
import { computed, inject, onMounted, onUpdated, reactive, ref } from 'vue';
import listDrug from 'src/components/Shared/CRUD/TableListActiveButton.vue';
import { useI18n } from 'vue-i18n';
import formService from 'src/services/formService/formService';

/*
Declarations
*/
const { t } = useI18n();
const mode = reactive(ref('list'));
const viewDrug = inject('viewDrug');
const editDrug = inject('editDrug');
const deleteDrug = inject('deleteDrug');
const title = inject('titleList');
const promptToConfirm = inject('promptToConfirm');
const columns = [
  {
    name: 'atccode_id',
    required: true,
    label: t('atccode_id'),
    align: 'left',
    field: (row) => row.atccode_id,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'name',
    align: 'left',
    label: t('name'),
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'form',
    align: 'left',
    label: t('form'),
    field: (row) => row.form,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'packsize',
    align: 'left',
    label: t('packsize'),
    field: (row) => row.packsize,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'active',
    align: 'left',
    label: t('active'),
    field: (row) => (row.active ? t('true') : t('false')),
    format: (val) => `${val}`,
    sortable: true,
  },
];
/*
  Mounted Hooks
*/
onUpdated ==
  onMounted(() => {
    drugService.get(0);
    formService.get(0);
  });

/*
  Computed
*/
const allDrugs = computed(() => {
  const drugList = [];
  for (const drug of drugService.getAllFromStorage()) {
    if (drug.form !== null) {
      const formID = drug.form;
      drug.form =
        formService.getFormByID(formID) !== null
          ? formService.getFormByID(formID).form
          : null;
      drugList.push(drug);
    }
  }

  return drugList;
});

/*
  Methods
*/
</script>
