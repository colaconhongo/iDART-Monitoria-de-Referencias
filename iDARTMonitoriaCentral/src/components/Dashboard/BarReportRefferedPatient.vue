<template>
  <div
    style="width: 99%; height: 100%;linear-gradient( 135deg, #343E59 10%, #2B2D3E 40%)"
    class="panel"
  >
    <apexchart
      width="95%"
      height="600px"
      type="bar"
      :options="chartOptions"
      :series="series.series1"
    ></apexchart>
  </div>
</template>

<script setup>
import VueApexCharts from 'vue3-apexcharts';
import { reactive, watch, inject } from 'vue';
import patientService from 'src/services/patientService/patientService';
import EpisodeService from 'src/services/episodeService/episodeService';
import DashboardUtils from '../../use/DashboardUtils';
const monthsX = [
  'JAN',
  'FEV',
  'MAR',
  'ABR',
  'MAI',
  'JUN',
  'JUL',
  'AGO',
  'SET',
  'OUT',
  'NOV',
  'DEC',
];
const apexchart = VueApexCharts;

const props = defineProps({
  loaded: {
    type: Object,
  },
});

const total = inject('total');
const yearAnnualPeriod = inject('year');
const district = inject('district');
const pharmacy = inject('pharmacy');
const us = inject('us');

const selectedModel = inject('selectedModel');

const chartOptions = {
  chart: {
    id: 'vuechart-example',
  },
  xaxis: {
    categories: [...monthsX],
  },
  colors: ['#0000CD', '#00BFFF'],
  animations: {
    enabled: true,
    easing: 'easeinout',
    speed: 1000,
  },
  title: {
    text: 'Pacientes Referidos vs Pacientes que voltaram a US',
    align: 'center',
    style: {
      color: '#000000',
    },
  },
  plotOptions: {
    bar: {
      borderRadius: 10,
    },
  },
  dataLabels: {
    enabled: false,
    position: top,
  },
};

watch([props.loaded, selectedModel], () => {
  if (props.loaded) {
    const patientsToCount = [];
    const patientMale = [];
    const patientFemale = [];
    let endEpisodes = [];

    let patients = [];

    if (us.value !== null && us.value !== undefined && us.value !== '') {
      endEpisodes =
        EpisodeService.getEpisodesByYearAndDistrictAndClinicAndPharmacyFromLocalStorage(
          us.value.mainclinicname,

          // let patients = [];

          // if (selectedModel.value.id === 1) {
          //   if (us.value !== null && us.value !== undefined) {
          //     endEpisodes =
          //       EpisodeService.getDCEpisodesByYearAndDistrictAndClinicSectorFromLocalStorage(
          //         yearAnnualPeriod.value,
          //         district,
          //         pharmacy,
          //         us.value.mainclinicuuid
          //       );
          //     patients =
          //       patientService.getDCPatientsByYearAndDistrictAndClinicSectorFromLocalStorage(
          //         yearAnnualPeriod.value,
          //         district,
          //         pharmacy,
          //         us.value.mainclinicuuid
          //       );
          //   } else {
          //     endEpisodes =
          //       EpisodeService.getAllDCEpisodesByYearAndDistrictAndClinicSectorFromLocalStorage(
          //         yearAnnualPeriod.value,
          //         district,
          //         pharmacy
          //       );
          //     patients =
          //       patientService.getAllDCPatientsByYearAndDistrictAndClinicSectorFromLocalStorage(
          //         yearAnnualPeriod.value,
          //         district,
          //         pharmacy
          //       );
          //   }
          // } else {
          //   endEpisodes =
          // EpisodeService.getEpisodesByYearAndDistrictAndClinicAndPharmacyFromLocalStorage(

          yearAnnualPeriod.value,
          district,
          pharmacy
        );
    } else {
      endEpisodes =
        EpisodeService.getEpisodesByYearAndDistrictAndClinicAndPharmacyFromLocalStorage(
          '',
          // patients =
          //   patientService.getPatientsByYearAndDistrictAndClinicAndPharmacyFromLocalStorage(

          yearAnnualPeriod.value,
          district,
          pharmacy
        );
    }

    if (
      pharmacy.value !== null &&
      pharmacy.value !== undefined &&
      us.value !== null &&
      us.value !== undefined
    ) {
      patients =
        patientService.getPatientsByYearAndUSAndDistrictAndPharmacyFromLocalStorage(
          us.value.mainclinicname,
          yearAnnualPeriod.value,
          district,
          pharmacy
        );
    } else if (pharmacy.value !== null && pharmacy.value !== undefined) {
      patients =
        patientService.getPatientsByYearAndDistrictAndClinicAndPharmacyAndUSFromLocalStorage(
          yearAnnualPeriod.value,
          district,
          pharmacy
        );
    } else if (us.value !== null && us.value !== undefined) {
      patients =
        patientService.getPatientsByYearAndUSAndDistrictFromLocalStorage(
          us.value.mainclinicname,
          yearAnnualPeriod.value,
          district
        );
    } else {
      patients =
        patientService.getPatientsByYearAndDistrictAndClinicAndPharmacyFromLocalStorage(
          yearAnnualPeriod.value,
          district,
          pharmacy
        );
    }

    // let endEpisodes = [];
    // let patients = [];

    // if (selectedModel.value.id === 1) {
    //   if (us.value !== null && us.value !== undefined) {
    //     endEpisodes =
    //       EpisodeService.getDCEpisodesByYearAndDistrictAndClinicSectorFromLocalStorage(
    //         yearAnnualPeriod.value,
    //         district,
    //         pharmacy,
    //         us.value.mainclinicuuid
    //       );
    //     patients =
    //       patientService.getDCPatientsByYearAndDistrictAndClinicSectorFromLocalStorage(
    //         yearAnnualPeriod.value,
    //         district,
    //         pharmacy,
    //         us.value.mainclinicuuid
    //       );
    //   } else {
    //     endEpisodes =
    //       EpisodeService.getAllDCEpisodesByYearAndDistrictAndClinicSectorFromLocalStorage(
    //         yearAnnualPeriod.value,
    //         district,
    //         pharmacy
    //       );
    //     patients =
    //       patientService.getAllDCPatientsByYearAndDistrictAndClinicSectorFromLocalStorage(
    //         yearAnnualPeriod.value,
    //         district,
    //         pharmacy
    //       );
    //   }
    // } else {
    //   endEpisodes =
    //     EpisodeService.getEpisodesByYearAndDistrictAndClinicAndPharmacyFromLocalStorage(
    //       yearAnnualPeriod.value,
    //       district,
    //       pharmacy
    //     );
    //   patients =
    //     patientService.getPatientsByYearAndDistrictAndClinicAndPharmacyFromLocalStorage(
    //       yearAnnualPeriod.value,
    //       district,
    //       pharmacy
    //     );
    // }

    const endEpisodeMonthly =
      DashboardUtils.organizeEpisodesByMonth(endEpisodes);

    let resultPatients1 = groupedMap(patients, 'patientid');
    const mapIter1 = resultPatients1.values();
    for (const item of mapIter1) {
      const firstItem = item[0];
      if (firstItem.sex === 'F') patientFemale.push(firstItem);
      if (firstItem.sex === 'M') patientMale.push(firstItem);
      patientsToCount.push(firstItem);
    }
    const startEpisodeMonthly =
      DashboardUtils.organizeRefferedPatientsByMonth(patientsToCount);
    const arrRefferred = [];
    if (startEpisodeMonthly !== undefined) {
      const mapIter = startEpisodeMonthly.values();
      for (const item of mapIter) {
        arrRefferred.push(item.data);
      }
    }
    const arrEnding = [];
    if (endEpisodeMonthly !== undefined) {
      const mapIter2 = endEpisodeMonthly.values();
      for (const item of mapIter2) {
        arrEnding.push(item.data);
      }
    }
    series.series1 = [];
    series.series1 = [
      {
        name: 'Total Pacientes Novos Referidos',
        data: [...arrRefferred],
      },
      {
        name: 'Total Pacientes Que Voltaram para US',
        data: [...arrEnding],
      },
    ];
    total.totalNumbers = patientsToCount.length;
    total.totalMaleNumbers = patientMale.length;
    total.totalFemaleNumbers = patientFemale.length;
    total.totalBackNumbers = endEpisodes.length;
  }
});

let series = reactive({
  series1: [
    {
      name: 'series-1',
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
  ],
});

const groupedMap = (items, key) =>
  items.reduce(
    (entryMap, e) => entryMap.set(e[key], [...(entryMap.get(e[key]) || []), e]),
    new Map()
  );
</script>
<style lang="scss" scoped>
.panel {
  border: 1px solid $grey-13;
  border-radius: 15px;
  background-color: white;
}
</style>
