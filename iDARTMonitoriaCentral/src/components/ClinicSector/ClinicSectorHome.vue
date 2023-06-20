<template>
  <q-page class="q-pa-sm q-gutter-sm">
    <listClinicSector
      :columns="columns"
      :mode="mode"
      :with_downloadButton="true"
      :with_actionDetailButton="true"
      :with_actionEditButton="false"
      :with_actionRemoveButton="false"
      :rows="allClinicSectors"
      :title="title"
      :visualizar="viewClinicSector"
      :editar="editClinicSector"
      :remover="deleteClinicSector"
    />
  </q-page>
</template>
<script setup>
import { useQuasar, QSpinnerBall } from 'quasar';
import clinicSectorService from 'src/services/clinicSectorService/clinicSectorService';
import { computed, inject, onMounted, reactive, ref } from 'vue';
import listClinicSector from 'src/components/Shared/CRUD/TableList.vue';
import { useI18n } from 'vue-i18n';
import clinicSectorTypeService from 'src/services/clinicSectorTypeService/clinicSectorTypeService';
import clinicService from 'src/services/clinicService/clinicService';

/*
Declarations
*/
const $q = new useQuasar();
const { t } = useI18n();
const mode = reactive(ref('list'));
const viewClinicSector = inject('viewClinicSector');
const editClinicSector = inject('editClinicSector');
const deleteClinicSector = inject('deleteClinicSector');
const title = inject('titleList');
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
    name: 'sectorname',
    align: 'left',
    label: t('sectorname'),
    field: (row) => row.sectorname,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'clinicsectortype',
    align: 'left',
    label: t('clinicsectortype'),
    field: (row) =>
      row.clinicsectortypee !== null
        ? row.clinicsectortypee.description
        : 'Sem info.',
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'clinic',
    align: 'left',
    label: t('clinic'),
    field: (row) =>
      clinicService.getClinicByID(row.clinic)[0] != null &&
      clinicService.getClinicByID(row.clinic)[0] !== undefined
        ? clinicService.getClinicByID(row.clinic)[0].clinicname
        : 'Sem Info.',
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
  getAllClinicSectorFromAPI(0);
});

/*
  Computed
*/
const allClinicSectors = computed(() => {
  return clinicSectorService.getAllFromStorage();
});

/*
  Methods
*/

const getAllClinicSectorFromAPI = (offset) => {
  if (offset >= 0) {
    const clinicSectorList = [];
    for (const clinicUS of clinicService.getAllUS()) {
      clinicSectorList.push(clinicUS.uuid);
    }
    clinicSectorService.getAllFromClinicUuidList(clinicSectorList, offset);
    clinicSectorTypeService.get(offset);
  }
};
</script>
