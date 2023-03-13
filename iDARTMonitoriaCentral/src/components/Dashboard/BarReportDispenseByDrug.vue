<template>
  <div
    style="width: 99%; height: 100%;linear-gradient( 135deg, #343E59 10%, #2B2D3E 40%)"
    class="panel"
  >
    <apexchart
      width="95%"
      height="600px"
      type="bar"
      :options="chartOptionsDispenseByDrug"
      :series="series3.series3"
    ></apexchart>
  </div>
</template>

<script setup>
import VueApexCharts from 'vue3-apexcharts';
import randomcolor from 'randomcolor';
import { reactive, watch, inject } from 'vue';
import DispenseService from 'src/services/dispenseService/dispenseService';
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

const chartOptionsDispenseByDrug = {
  chart: {
    id: 'vuechart-example',
  },
  xaxis: {
    categories: [...monthsX],
  },
  animations: {
    enabled: true,
    easing: 'easeinout',
    speed: 1000,
  },
  title: {
    text: 'Total de Dispensas Por Medicamento',
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
  legend: {
    show: true,
  },
};

let series3 = reactive({
  series3: [
    {
      name: 'series-1',
      data: [0],
    },
  ],
});

const props = defineProps({
  loaded: {
    type: Object,
  },
});
const year = inject('year');
const district = inject('district');
const pharmacy = inject('pharmacy');
const us = inject('us');
const selectedModel = inject('selectedModel');
let allDispenses = [];

watch([props.loaded, selectedModel], () => {
  if (props.loaded) {
    if (selectedModel.value.id === 1) {
      if (us.value !== null && us.value !== undefined) {
        allDispenses =
          DispenseService.getDCDispensesByYearAndDistrictAndClinicSectorFromLocalStorage(
            year.value,
            district,
            pharmacy,
            us.value.mainclinicuuid
          );
      } else {
        allDispenses =
          DispenseService.getDCDispensesByYearAndDistrictAndClinicSectorFromLocalStorage(
            year.value,
            district,
            pharmacy,
            null
          );
      }
    } else {
      allDispenses =
        DispenseService.getDispensesByYearAndDistrictAndClinicAndPharmacyFromLocalStorage(
          year.value,
          district,
          pharmacy
        );
    }

    let resultDrugs = groupedMap(allDispenses, 'drugname');
    // dispense by drug
    const keysByDrug = Array.from(resultDrugs.keys());
    series3.series3 = [];
    chartOptionsDispenseByDrug.colors = [];
    keysByDrug.forEach((key) => {
      const keys = DashboardUtils.organizeDispensesByMonth(
        resultDrugs.get(key)
      );
      const regimeType = [];
      if (keys != undefined) {
        const mapIter = keys.values();
        for (const item of mapIter) {
          regimeType.push(item.data);
        }
      }

      const color = randomcolor(); // a hex code for an attractive color
      //  item.style = 'background-color:' + color + ';' + 'color: ##ffffff'
      chartOptionsDispenseByDrug.colors.push(color);
      series3.series3.push({
        name: key,
        data: [...regimeType],
      });
    });
  }
});

const groupedMap = (items, key) =>
  items.reduce(
    (entryMap, e) => entryMap.set(e[key], [...(entryMap.get(e[key]) || []), e]),
    new Map()
  );
</script>
<style lang="scss" scoped>
.panel {
  border: 0.5px solid $grey-13;
  border-radius: 15px;
  background-color: white;
}
</style>
