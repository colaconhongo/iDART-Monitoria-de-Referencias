<template>
  <q-page class="q-pa-sm q-gutter-sm">
    <PatientSearchFields></PatientSearchFields>
    <listPatient
      :columns="columns"
      :rows="allPatients"
      :title="title"
      :visualizar="viewPatient"
      :with_actionsButton="true"
      :with_actionDetailButton="true"
      :with_downloadButton="false"
      :with_actionRemoveButton="false"
      :with_actionEditButton="false"
    />
  </q-page>
</template>
<script setup>
import { computed, inject, reactive, provide } from 'vue';
import patientService from 'src/services/patientService/patientService';
import listPatient from 'src/components/Shared/CRUD/TableList.vue';
import PatientSearchFields from 'src/components/patients/PatientSearchFields.vue';
import { useI18n } from 'vue-i18n';
import Patient from 'src/stores/models/patient/patient';
import useUtils from 'src/use/useUtils';
/*
Declarations
*/

const currPatient = reactive(new Patient());
const { t } = useI18n();
const viewPatient = inject('viewPatient');
const title = inject('titleList');
const district = inject('district');
const pharmacy = inject('pharmacy');
const us = inject('us');
const selectedModel = inject('selectedModel');
const dispenseModels = inject('dispenseModels');

const columns = [
  {
    name: 'patientid',
    required: true,
    label: t('patientid'),
    align: 'left',
    field: (row) => row.patientid,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'firstnames',
    align: 'left',
    label: t('firstnames'),
    field: (row) => row.firstnames + ' ' + row.lastname,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'dateofbirth',
    align: 'left',
    label: t('dateofbirth'),
    field: (row) => useUtils.ageCalculator(row.dateofbirth) + ' anos',
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'sex',
    align: 'left',
    label: t('sex'),
    field: (row) => (row.sex === 'F' ? 'Feminino' : 'Masculino'),
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'mainclinic',
    align: 'left',
    label: t('mainclinic'),
    field: (row) => row.mainclinicname,
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
];

/*
  Computed
*/
const allPatients = computed(() => {
  if (selectedModel.value.id === 1) {
    if (us.value !== null && us.value !== undefined) {
      return patientService.getDCPatientsByClinicuuidFromLocalStorage(
        us.value.mainclinicuuid,
        pharmacy,
        currPatient
      );
    } else {
      return patientService.getAllDCPatientsFromLocalStorage(
        district,
        pharmacy,
        currPatient
      );
    }
  } else {
    if (us.value !== null && us.value !== undefined) {
      return patientService.getPatientsByDistrictAndUSFromLocalStorage(
        us.value.mainclinicname,
        pharmacy,
        currPatient
      );
    } else {
      return patientService.getPatientsByDistrictAndPharmacyFromLocalStorage(
        district,
        pharmacy,
        currPatient
      );
    }
  }
});

/*
  Methods
*/

provide('allPatients', allPatients);
provide('currPatient', currPatient);
provide('dispenseModels', dispenseModels);
</script>
