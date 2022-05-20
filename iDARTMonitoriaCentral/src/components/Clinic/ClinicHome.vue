<template>
  <q-page class="q-pa-sm q-gutter-sm">
    <listClinic
      :columns="columns"
      :mode="mode"
      :with_downloadButton="true"
      :rows="allClinics"
      :title="props.title"
    />
  </q-page>
</template>
<script setup>
import { useQuasar, QSpinnerBall } from 'quasar';
import clinicService from 'src/services/clinicService/clinicService';
import { computed, onMounted, reactive, ref } from 'vue';
import listClinic from 'src/components/Shared/CRUD/TableList.vue';

/*
Props
*/

const props = defineProps({
  title: {
    type: String,
  },
});

/*
Declarations
*/
const $q = new useQuasar();
const mode = reactive(ref('list'));
const columns = [
  {
    name: 'code',
    required: true,
    label: 'Código',
    align: 'left',
    field: (row) => row.code,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'clinicname',
    align: 'left',
    label: 'Nome',
    field: (row) => row.clinicname,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'facilitytype',
    align: 'left',
    label: 'Tipo de Farmácia',
    field: (row) => row.facilitytype,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'province',
    align: 'left',
    label: 'Provínvia',
    field: (row) => row.province,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'district',
    align: 'left',
    label: 'Distrito',
    field: (row) => row.district,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'telephone',
    align: 'left',
    label: 'Telefone',
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
