<template>
<apexchart
       width="100%"
       height="600px"
      type="bar"
      :options="chartOptionsDispenseByDrug"
      :series="series3.series3"
    ></apexchart>
</template>

<script setup>
import VueApexCharts from 'vue3-apexcharts';
import randomcolor from 'randomcolor';
import { computed, onMounted, ref, onBeforeMount, reactive , watch , toRefs } from 'vue';
import patientService from 'src/services/patientService/patientService';
import ClinicService from 'src/services/clinicService/clinicService';
import DispenseService from 'src/services/dispenseService/dispenseService';
 import moment from 'moment';
 const monthsX = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEC']
const weeksX = ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4', 'Semana 5']
const toDateStr = str => new Date(str.replace(/^(\d+)\/(\d+)\/(\d+)$/, '$2/$1/$3'))
const monthsEng = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
const apexchart = VueApexCharts;

const chartOptionsDispenseByDrug = {
        chart: {
          id: "vuechart-example",
        },
        xaxis: {
          categories: [...monthsX]
        },
         colors: ['#F44336', '#13c185'],
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

let series3 = reactive({
  series3 : [
        {
          name: "series-1",
          data: [0],
        },
       ]
})

const props = defineProps({
   loaded: {
    type: Object,
  }
});
console.log(props)


// const loaded = ref(props.loaded)
// const { loaded } = toRefs(props)

watch(props.loaded, () => {
  console.log(props.loaded)
   if(props.loaded) {
     const allDispenses = DispenseService.getDispensesByRegimeByYearFromLocalStorage(2021);
      let resultDrugs = groupedMap(allDispenses , 'drugname')
      // dispense by drug
        const keysByDrug = Array.from(resultDrugs.keys())
      series3.series3 = []
       keysByDrug.forEach( (key) => {
         const keys = organizeDispensesByMonth(resultDrugs.get(key))
         const regimeType = []
            if (keys !== undefined) {
       const mapIter = keys.values()
       for (const item of mapIter) {
         regimeType.push(item.data)
         }
         }
          
                   const color = randomcolor();// a hex code for an attractive color
                   console.log(color)
                 //  item.style = 'background-color:' + color + ';' + 'color: ##ffffff'
         chartOptionsDispenseByDrug.colors.push(color)
         series3.series3.push(
            {
          name: key,
          data: [...regimeType],
        },
         )
       })
   }
});

   const organizeDispensesByMonth = (list) =>
  {
      var monthsPresent = []
   const map = list.reduce((a, b) => {
  const m = toDateStr(b.dispensedate).getMonth()
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
