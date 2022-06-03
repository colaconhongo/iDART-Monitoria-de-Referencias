<template>
  <q-page class="q-pa-sm q-gutter-sm">
    <listRegimen
      :columns="columns"
      :mode="mode"
      :with_downloadButton="true"
      :with_activeButton="true"
      :with_actionDetailButton="true"
      :with_actionEditButton="false"
      :with_actionRemoveButton="false"
      :rows="allRegimens"
      :title="title"
      :visualizar="viewRegimen"
      :editar="editRegimen"
      :remover="deleteRegimen"
      :promptToConfirm="promptToConfirm"
    />
  </q-page>
</template>
<script setup>
import { useQuasar, QSpinnerBall } from 'quasar';
import regimenService from 'src/services/regimenService/regimenService';
import { computed, inject, onMounted, reactive, ref } from 'vue';
import listRegimen from 'src/components/Shared/CRUD/TableListActiveButton.vue';
import { useI18n } from 'vue-i18n';

/*
Declarations
*/
const $q = new useQuasar();
const { t } = useI18n();
const mode = reactive(ref('list'));
const viewRegimen = inject('viewRegimen');
const editRegimen = inject('editRegimen');
const deleteRegimen = inject('deleteRegimen');
const title = inject('titleList');
const promptToConfirm = inject('promptToConfirm');
const columns = [
  {
    name: 'codigoregime',
    required: true,
    label: t('codigoregime'),
    align: 'left',
    field: (row) => row.codigoregime,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'regimeesquema',
    align: 'left',
    label: t('regimeesquema'),
    field: (row) => row.regimeesquema,
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
onMounted(() => {
  $q.loading.show({
    message: 'Carregando ...',
    spinnerColor: 'grey-4',
    spinner: QSpinnerBall,
  });
  setTimeout(() => {
    $q.loading.hide();
  }, 600);
  getAllRegimenFromAPI(0);
});

/*
  Computed
*/
const allRegimens = computed(() => {
  return regimenService.getAllFromStorage();
});

/*
  Methods
*/

const getAllRegimenFromAPI = (offset) => {
  if (offset >= 0) {
    regimenService.get(offset);
  }
};
</script>
