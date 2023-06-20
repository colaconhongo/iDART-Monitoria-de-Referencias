<template>
  <q-page class="q-pa-sm q-gutter-sm">
    <listClinic
      :columns="columns"
      :with_downloadButton="true"
      :with_actionDetailButton="true"
      :with_actionEditButton="true"
      :with_actionRemoveButton="true"
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
import { computed, inject, onMounted, reactive, ref, watch } from 'vue';
import listClinic from 'src/components/Shared/CRUD/TableList.vue';
import { useI18n } from 'vue-i18n';
import provinceService from 'src/services/provinceService/provinceService';
import districtService from 'src/services/districtService/districtService';

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
const district = inject('district');
const clinic = inject('clinic');
const pharmacy = inject('pharmacy');
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
    label: 'Farmácia de Referência',
    field: (row) => row.clinicname,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'facilitytype',
    align: 'left',
    label: 'Tipo da Farmácia',
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
  getAllClinicFromAPI(0);
});

/*
  Computed
*/

const allClinics = computed(() => {
  return clinicService.getDDPharmByDistrictAndPharmFromLocalStorage(
    district,
    pharmacy
  );
});

/*
  Methods
*/

const getAllClinicFromAPI = (offset) => {
  if (offset >= 0) {
    clinicService.get(offset);
    provinceService.get(offset);
    districtService.get(offset);
  }
};
</script>
