<template>
  <div class="q-pa-sm q-gutter-md">
    <Filter class="q-mb-lg" />
    <div class="row">
      <div class="col-3 q-ml-sm q-mr-sm" style="max-width: 500px">
        <q-bar dark class="bg-primary text-white">
          <div class="col text-center text-weight-bold">Listagens</div>
        </q-bar>
      </div>
      <div class="col q-mr-sm">
        <q-bar dark class="bg-primary text-white">
          <div class="col text-center text-weight-bold">Resultados</div>
        </q-bar>
      </div>
    </div>

    <div class="row">
      <div class="col-3 q-ml-sm q-mr-sm panel" style="max-width: 500px">
        <ListReportMenu @changeTab="changeTab" />
      </div>
      <div class="col q-mr-sm panel q-pa-sm">
        <q-scroll-area
          :thumb-style="thumbStyle"
          :content-style="contentStyle"
          :content-active-style="contentActiveStyle"
          style="height: 700px"
          class="q-pr-md"
        >
          <template v-for="comp in components" :key="comp.id">
            <component :is="reportComps[comp.name]" class="q-mb-sm" />
          </template>
        </q-scroll-area>
      </div>
    </div>
  </div>
</template>

<script setup>
/*
  Imports
  */
import ListReportMenu from 'src/components/Reports/Menu/ListReportMenu.vue';
import ReferedPatientsList from 'src/components/Reports/ReferedPatientsList.vue';
import ReturnedReferedPatient from 'src/components/Reports/ReturnedReferedPatient.vue';
import PatientsWithMissDispenses from 'src/components/Reports/PatientsWithMissDispenses.vue';
import PatientDispenseHistory from 'src/components/Reports/PatientDispenseHistory.vue';
import DispenseByDrugAndRegimen from 'src/components/Reports/DispenseByDrugAndRegimen.vue';
import PatientWithScreeningList from 'src/components/Reports/PatientWithScreeningList.vue';
import NotSyncDispenses from 'src/components/Reports/NotSyncDispenses.vue';
import ActivePatientList from 'src/components/Reports/ActivePatientList.vue';
import ActivePatientDDDModel from 'src/components/Reports/Research/ActivePatientDDDModel.vue';
import InactivePatientDDDModel from 'src/components/Reports/Research/InactivePatientDDDModel.vue';
import EnrolledPatientIndicator from 'src/components/Reports/Research/EnrolledPatientIndicator.vue';
import DashboardUtils from '../../use/DashboardUtils';
import { SessionStorage } from 'quasar';
import ClinicService from 'src/services/clinicService/clinicService';
import PatientService from 'src/services/patientService/patientService';
import Filter from 'src/components/Filter/Filter.vue';
import provinceService from 'src/services/provinceService/provinceService';
import clinicService from 'src/services/clinicService/clinicService';
import districtService from 'src/services/districtService/districtService';
import { QSpinnerBall, uid, useQuasar } from 'quasar';
import {
  reactive,
  ref,
  provide,
  computed,
  onActivated,
  onDeactivated,
  onUpdated,
  onMounted,
} from 'vue';

const $q = useQuasar();
let us = ref();
let loaded = reactive({
  loaded: false,
});

let year = ref(new Date().getFullYear());
const yearsToShow = DashboardUtils.getLastFiveYears();
let components = reactive([]);

const contentStyle = {
  backgroundColor: '#ffffff',
  color: '#555',
};

const contentActiveStyle = {
  backgroundColor: '#eee',
  color: 'white',
};

const thumbStyle = {
  right: '2px',
  borderRadius: '5px',
  backgroundColor: '#2b72d6',
  width: '5px',
  opacity: 0.75,
};
const reportComps = {
  ReferedPatientsList,
  ReturnedReferedPatient,
  PatientsWithMissDispenses,
  PatientDispenseHistory,
  ActivePatientList,
  DispenseByDrugAndRegimen,
  PatientWithScreeningList,
  NotSyncDispenses,
  ActivePatientDDDModel,
  InactivePatientDDDModel,
  EnrolledPatientIndicator,
};

const district = reactive(ref());
const facility = reactive(ref());
const pharmacy = reactive(ref());

/*
  Methods
  */
const changeTab = (tabName) => {
  const uidValue = 'report' + uid();
  const comp = { id: uidValue, name: tabName };
  console.log(comp);
  components.push(comp);
};

/*
  Mounted Hooks
*/
onUpdated ==
  onMounted(() => {
    $q.loading.show({
      message: 'Carregando ...',
      spinnerColor: 'grey-4',
      spinner: QSpinnerBall,
    });
    setTimeout(() => {
      $q.loading.hide();
    }, 600);
    provinceService.get(0);
    districtService.get(0);
    clinicService.get(0);
  });

/*
  Computed
*/
const province = computed(() => {
  return provinceService.getFirstProvinceByNameFromStorage();
});
/*
  Computed
*/
const allProvincias = computed(() => {
  return provinceService.getAllFromStorage();
});

const alldistrictsFromProvince = computed(() => {
  return districtService.getAllProvinceFromStorage();
});

const allPhamacyFromFacility = computed(() => {
  if (district.value != null || district.value != undefined) {
    let pharmaciesResult;
    if (us.value != null || us.value != undefined) {
      // Query com filtro por US
      const lst = PatientService.getPharmaciesIdsByUS(us.value.mainclinicuuid);
      pharmaciesResult = ClinicService.getPharmaciesByUuidList(lst); // Retorna Clinicas privadas para as quais a 'US' referenciou seus pacientes
    } else {
      // Query com filtro por Distrito apenas
      pharmaciesResult = ClinicService.getAllPharmacyFromDistrict(
        district.value.name
      );
    }
    return pharmaciesResult;
  }
  return null;
});

onActivated(() => {
  if (SessionStorage.getItem('district') !== null) {
    district.value = SessionStorage.getItem('district');
  }
  if (SessionStorage.getItem('us') !== null) {
    us.value = SessionStorage.getItem('us');
  }
  if (SessionStorage.getItem('pharmacy') !== null) {
    pharmacy.value = SessionStorage.getItem('pharmacy');
  }
});

onDeactivated(() => {
  if (district.value !== null && district.value !== undefined)
    SessionStorage.set('district', district.value);
  if (us.value !== null && us.value !== undefined)
    SessionStorage.set('us', us.value);
  if (pharmacy.value !== null && pharmacy.value !== undefined)
    SessionStorage.set('pharmacy', pharmacy.value);
});

const allUS = computed(() => {
  if (district.value != null || district.value != undefined) {
    return PatientService.getUSByPatientsOnDistrict(district.value.name);
  } else return [];
});

provide('allProvincias', allProvincias);
provide('alldistrictsFromProvince', alldistrictsFromProvince);
provide('allPhamacyFromFacility', allPhamacyFromFacility);

provide('province', province);
provide('district', district);
provide('facility', facility);
provide('pharmacy', pharmacy);
provide('allUSFromDistrict', allUS);
provide('us', us);

provide('yearsToShow', yearsToShow);
provide('year', year);
</script>

<style lang="scss" scoped>
.panel {
  border: 1px solid $grey-13;
  border-radius: 0px;
}
</style>
