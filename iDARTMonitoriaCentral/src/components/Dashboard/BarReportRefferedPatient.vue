<template>
<div style="width: 100%; height: 100%;linear-gradient( 135deg, #343E59 10%, #2B2D3E 40%)">
 <apexchart
      width="100%"
       height="600px"
      type="bar"
      :options="chartOptions"
      :series="series.series1"
    ></apexchart>
    </div>
</template>

<script setup>
import VueApexCharts from 'vue3-apexcharts';
import { reactive , watch , inject } from 'vue';
import patientService from 'src/services/patientService/patientService';
import EpisodeService from 'src/services/episodeService/episodeService';
 import moment from 'moment';
 const monthsX = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEC']
const weeksX = ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4', 'Semana 5']
const toDateStr = str => new Date(str.replace(/^(\d+)\/(\d+)\/(\d+)$/, '$2/$1/$3'))
const monthsEng = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
const apexchart = VueApexCharts;

const props = defineProps({
   loaded: {
    type: Object,
  }
});

const total = inject('total')
const yearAnnualPeriod = inject('yearAnnualPeriod')

const chartOptions = {
        chart: {
          id: "vuechart-example",
        },
        xaxis: {
          categories: [...monthsX]
        },
         colors: ['#0000CD', '#00BFFF'],
            animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 1000
        },
         plotOptions: {
              bar: {
                borderRadius: 10
              }
           },
            dataLabels: {
          enabled: false,
          position : top
        },
      };

watch(props.loaded, () => {
    console.log(yearAnnualPeriod)
  console.log(props.loaded)
   if(props.loaded) {
const  patientsToCount =  [];
  const  patientMale =  [];
       const  patientFemale =  [];
  const endEpisodes = EpisodeService.getEpisodesByYearFromLocalStorage(yearAnnualPeriod.value);
   const endEpisodeMonthly = organizeEpisodesByMonth(endEpisodes);
    const patients = patientService.getPatientsByYearFromLocalStorage(yearAnnualPeriod.value);
    console.log(patients)
     console.log(endEpisodeMonthly)
      let resultPatients1 = groupedMap(patients , 'patientid');
        const mapIter1 = resultPatients1.values()
            for (const item of mapIter1) {
           const firstItem = item[0]
            if(firstItem.sex === 'F') patientFemale.push(firstItem)
            if(firstItem.sex === 'M') patientMale.push(firstItem)
           patientsToCount.push(firstItem)
            }
        const startEpisodeMonthly = organizeRefferedPatientsByMonth(patientsToCount);
       const arrRefferred = []
            if (startEpisodeMonthly !== undefined) {
       const mapIter = startEpisodeMonthly.values()
       for (const item of mapIter) {
         arrRefferred.push(item.data)
         }
         }
           const arrEnding = []
            if (endEpisodeMonthly !== undefined) {
       const mapIter2 = endEpisodeMonthly.values()
       for (const item of mapIter2) {
         arrEnding.push(item.data)
         }
         }
         series.series1 = [];
           series.series1 = [
        {
          name:'Total Pacientes Novos Referidos',
          data: [...arrRefferred]
        },
          {
          name:'Total Pacientes Que Voltaram para US',
          data: [...arrEnding]
        },
      ];
       total.totalNumbers = patientsToCount.length;
             total.totalMaleNumbers = patientMale.length;
             total.totalFemaleNumbers = patientFemale.length;
             total.totalBackNumbers = endEpisodes.length;
   }
});

 let series = reactive({
  series1 : [
        {
          name: "series-1",
          data: [0,0,0,0,0,0,0,0,0,0,0,0]
        },
       ]
})

  const organizeRefferedPatientsByMonth = (list) =>
  {
      var monthsPresent = []
   const map = list.reduce((a, b) => {
     if(b.prescriptiondate !== null){ 
  const m = toDateStr(b.prescriptiondate).getMonth()
  a[m] = (a[m] || 0) + 1
  monthsPresent.push(monthsEng[+m])
     return a
}}, {})
   let result = Object.entries(map).map(([key, data]) => ({ data, key: monthsEng[+key] }))
   var monthsNot = monthsEng.filter(item => !monthsPresent.includes(item))
   for (const item of monthsNot) {
     result.push(({ data: 0, key: item }))
   }
  result = result.sort(function (a, b) {
  // sort based on the value in the monthNames object
  return +moment(a.key, 'MMM') - moment(b.key, 'MMM')
})
  return result
  }

   const organizeEpisodesByMonth = (list) =>
  {
      var monthsPresent = []
   const map = list.reduce((a, b) => {
  const m = toDateStr(b.stopdate).getMonth()
  a[m] = (a[m] || 0) + 1
  monthsPresent.push(monthsEng[+m])
     return a
}, {})
   let result = Object.entries(map).map(([key, data]) => ({ data, key: monthsEng[+key] }))
   var monthsNot = monthsEng.filter(item => !monthsPresent.includes(item))
   for (const item of monthsNot) {
     result.push(({ data: 0, key: item }))
   }
  result = result.sort(function (a, b) {
  // sort based on the value in the monthNames object
  return +moment(a.key, 'MMM') - moment(b.key, 'MMM')
})
  return result
  }

const groupedMap  = (items, key) => items.reduce(
    (entryMap, e) => entryMap.set(e[key], [...entryMap.get(e[key])||[], e]),
    new Map()
);

</script>
