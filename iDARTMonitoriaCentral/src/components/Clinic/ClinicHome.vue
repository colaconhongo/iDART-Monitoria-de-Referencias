<template>
  <q-page class="q-pa-sm q-gutter-sm">
    <listClinic
      :columns="columns"
      :mode="mode"
      :with_downloadButton="true"
      :rows="allClinics"
      :title="title"
      :visualizar="viewClinic"
      :editar="editClinic"
      :remover="deleteClinic"
    />
  </q-page>
</template>
<script setup>
import { useQuasar, QSpinnerBall } from 'quasar';
import clinicService from 'src/services/clinicService/clinicService';
import { computed, inject, onMounted, reactive, ref } from 'vue';
import listClinic from 'src/components/Shared/CRUD/TableList.vue';
import { useI18n } from 'vue-i18n';

/*
Declarations
*/
const $q = new useQuasar();
const { t } = useI18n();
const mode = reactive(ref('list'));
const viewClinic = inject('viewClinic');
const editClinic = inject('editClinic');
const deleteClinic = inject('deleteClinic');
const title = inject('titleList');
const columns = [
  {
    name: 'code',
    required: true,
    label: t('code'),
    align: 'left',
    field: (row) => row.code,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'clinicname',
    align: 'left',
    label: t('clinicname'),
    field: (row) => row.clinicname,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'facilitytype',
    align: 'left',
    label: t('facilitytype'),
    field: (row) => row.facilitytype,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'province',
    align: 'left',
    label: t('province'),
    field: (row) => row.province,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'district',
    align: 'left',
    label: t('district'),
    field: (row) => row.district,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'telephone',
    align: 'left',
    label: t('telephone'),
    field: (row) => row.telephone,
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
  getAllClinicFromAPI(0);
});

/*
  Computed
*/
const allClinics = computed(() => {
  return clinicService.getAllDDPharm();
});

/*
  Methods
*/

const getAllClinicFromAPI = (offset) => {
  if (offset >= 0) {
    clinicService.get(offset);
  }
};
</script>
