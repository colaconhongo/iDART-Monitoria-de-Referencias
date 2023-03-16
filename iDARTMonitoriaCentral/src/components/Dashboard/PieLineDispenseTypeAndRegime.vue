<template>
  <div class="row q-col-gutter-md q-px-md q-py-md">
    <div class="col-md-6 col-sm-12 col-xs-12">
      <div
        style="width: 100%; min-height: 200px; linear-gradient( 135deg, #343E59 10%, #2B2D3E 40%)"
        class="panel"
      >
        <apexchart
          width="100%"
          height="500"
          type="donut"
          :options="chartOptionsDispenseType"
          :series="series1.series1"
        ></apexchart>
      </div>
    </div>
    <div class="col-md-6 col-sm-12 col-xs-12">
      <div
        style="width: 100%; linear-gradient( 135deg, #343E59 10%, #2B2D3E 40%)"
        class="panel"
      >
        <apexchart
          width="100%"
          height="500"
          type="line"
          :options="chartOptionsRegimeType"
          :series="series2.series2"
        ></apexchart>
      </div>
    </div>
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
// const us = inject('us');
const selectedModel = inject('selectedModel');
const chartOptionsRegimeType = {
  // ApexCharts options
  chart: {
    id: 'vue-chart-line',
  },
  colors: ['#13c185'],
  title: {
    text: 'Total de Dispensas Por Regime',
    align: 'center',
    style: {
      color: '#000000',
    },
  },
  animations: {
    enabled: true,
    easing: 'easeinout',
    speed: 1000,
  },
  stroke: {
    show: true,
    curve: 'smooth',
    lineCap: 'butt',
    colors: undefined,
    width: 7,
    dashArray: 0,
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return val;
      },
    },
  },
  dataLabels: {
    enabled: true,
  },
  xaxis: {
    categories: [...monthsX],
  },
};

const chartOptionsDispenseType = {
  labels: ['Dispensa Mensal', 'Dispensa Trimestral', 'Dispensa Semestral'],
  colors: ['#aeff00', '#FF1493', '#13a6c1'],
  animations: {
    enabled: true,
    easing: 'easeinout',
    speed: 2000,
  },
  title: {
    text: 'Total de Dispensas',
    align: 'center',
    style: {
      color: '#000000',
    },
  },
  plotOptions: {
    pie: {
      donut: {
        labels: {
          show: true,
          name: {
            show: true,
            fontSize: '22px',
            fontFamily: 'Rubik',
            color: '#dfsda',
            offsetY: -10,
          },
          value: {
            show: true,
            fontSize: '16px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            color: undefined,
            offsetY: 16,
            formatter: function (val) {
              return val;
            },
          },
          total: {
            show: true,
            label: 'Total',
            color: '#373d3f',
            formatter: function (w) {
              return w.globals.seriesTotals.reduce((a, b) => {
                return a + b;
              }, 0);
            },
          },
        },
      },
    },
  },
};

let series1 = reactive({
  series1: [
    {
      name: 'series-1',
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
  ],
});

let series2 = reactive({
  series2: [
    {
      name: 'series-1',
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
  ],
});

const props = defineProps({
  loaded: {
    type: Object,
  },
});
const yearAnnualPeriod = inject('year');
const district = inject('district');
const pharmacy = inject('pharmacy');
const us = inject('us');

watch([props.loaded, selectedModel], (newCount) => {
  if (props.loaded) {
    const dispenseToRegime = [];
    const dispenseSemestral = [];
    const dispenseTrimestral = [];
    const dispenseMensal = [];
    let allDispenses = [];

    if (us.value !== null && us.value !== undefined) {
      allDispenses = DispenseService.getDispensesFromLocalStorage(
        us.value.mainclinicname,
        yearAnnualPeriod.value,
        district,
        pharmacy
      );
    } else {
      allDispenses = DispenseService.getDispensesFromLocalStorage(
        '',
        yearAnnualPeriod.value,
        district,
        pharmacy
      );
    }

    // if (selectedModel.value.id === 1) {
    //   if (us.value !== null && us.value !== undefined) {
    //     allDispenses =
    //       DispenseService.getDCDispensesByYearAndDistrictAndClinicSectorFromLocalStorage(
    //         yearAnnualPeriod.value,
    //         district,
    //         pharmacy,
    //         us.value.mainclinicuuid
    //       );
    //   } else {
    //     allDispenses =
    //       DispenseService.getDCDispensesByYearAndDistrictAndClinicSectorFromLocalStorage(
    //         yearAnnualPeriod.value,
    //         district,
    //         pharmacy,
    //         null
    //       );
    //   }
    // } else {
    //   allDispenses =
    //     DispenseService.getDispensesByYearAndDistrictAndClinicAndPharmacyFromLocalStorage(
    //       yearAnnualPeriod.value,
    //       district,
    //       pharmacy
    //     );
    // }
    let resultDispenses1 = groupedMap(allDispenses, 'patientid');
    const mapIter = resultDispenses1.values();
    for (const item of mapIter) {
      const firstItem = item[0];
      dispenseToRegime.push(firstItem);
      if (firstItem.dispensatrimestral === 1)
        dispenseTrimestral.push(firstItem);
      if (firstItem.dispensasemestral === 1) dispenseSemestral.push(firstItem);
      if (
        firstItem.dispensasemestral === 0 &&
        firstItem.dispensatrimestral === 0
      )
        dispenseMensal.push(firstItem);
    }
    let result = groupedMap(dispenseToRegime, 'regimenome');
    const activesTotal = [];
    activesTotal.push(dispenseSemestral.length);
    activesTotal.push(dispenseTrimestral.length);
    activesTotal.push(dispenseMensal.length);
    const keys = Array.from(result.keys());
    series2.series2 = [];
    keys.forEach((key) => {
      const keys = DashboardUtils.organizeDispensesByMonth(result.get(key));
      const regimeType = [];
      if (keys != undefined) {
        const mapIter = keys.values();
        for (const item of mapIter) {
          regimeType.push(item.data);
        }
      }

      const color = randomcolor(); // a hex code for an attractive color
      //  item.style = 'background-color:' + color + ';' + 'color: ##ffffff'
      chartOptionsRegimeType.colors.push(color);
      series2.series2.push({
        name: key,
        data: [...regimeType],
      });
    });
    series1.series1 = activesTotal;
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
  border: 1px solid $grey-13;
  border-radius: 15px;
  background-color: white;
}
</style>
