<template>
<div class="row q-col-gutter-md q-px-md q-py-md" >
 <div class="col-md-6 col-sm-12 col-xs-12">
    <div style="width: 100%; min-height: 200px; linear-gradient( 135deg, #343E59 10%, #2B2D3E 40%)" class="panel">
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
      <div style="width: 100%; linear-gradient( 135deg, #343E59 10%, #2B2D3E 40%)" class="panel">
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
import { computed, onMounted, ref, onBeforeMount, reactive , watch , inject } from 'vue';
import patientService from 'src/services/patientService/patientService';
import ClinicService from 'src/services/clinicService/clinicService';
import DispenseService from 'src/services/dispenseService/dispenseService';
 import moment from 'moment';
 import DashboardUtils from '../../use/DashboardUtils';
 const monthsX = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEC']
const weeksX = ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4', 'Semana 5']
const toDateStr = str => new Date(str.replace(/^(\d+)\/(\d+)\/(\d+)$/, '$2/$1/$3'))
const monthsEng = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
const apexchart = VueApexCharts;

 const chartOptionsRegimeType = { // ApexCharts options
        chart: {
          id: 'vue-chart-line'
        },
        colors: ['#13c185'],
         title: {
          text: 'Total de Dispensas Por Regime',
          align: 'center',
          style: {
            color: '#000000'
          }
          },
           animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 1000
        },
            stroke: {
    show: true,
    curve: 'smooth',
    lineCap: 'butt',
    colors: undefined,
    width: 7,
    dashArray: 0
},
tooltip: {
          y: {
            formatter: function (val) {
              return val
            }
          }
         },
      dataLabels: {
          enabled: true
        },
          xaxis: {
      categories: [...monthsX]
      }
        }

           const chartOptionsDispenseType = {
        labels: ['Dispensa Mensal', 'Dispensa Trimestral' , 'Dispensa Semestral'],
        colors: ['#aeff00', '#FF1493', '#13a6c1'],
          animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 2000
        },
      title: {
          text: 'Total de Dispensas',
          align: 'center',
          style: {
            color: '#000000'
          }
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
                  offsetY: -10
                },
                value: {
                  show: true,
                  fontSize: '16px',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  color: undefined,
                  offsetY: 16,
                  formatter: function (val) {
                    return val
                  }
                },
                total: {
                  show: true,
                  label: 'Total',
                  color: '#373d3f',
                  formatter: function (w) {
                    return w.globals.seriesTotals.reduce((a, b) => {
                      return a + b
                    }, 0)
                  }
                }
              }
            }
          }
        }
       }

let series1 = reactive({
  series1 : [
        {
          name: "series-1",
         data: [0,0,0,0,0,0,0,0,0,0,0,0]
        },
       ]
})

let series2 = reactive({
  series2 : [
        {
          name: "series-1",
          data: [0,0,0,0,0,0,0,0,0,0,0,0]
        },
       ]
})

const props = defineProps({
   loaded: {
    type: Object,
  }
});
console.log(props)
const yearAnnualPeriod = inject('yearAnnualPeriod')
const district = inject('district')
const clinic = inject('clinic')
const pharmacy = inject('pharmacy')


watch(props.loaded, (newCount) => {
  console.log(props.loaded)
   console.log(newCount)
   if(props.loaded) {
     const  dispenseToRegime =  [];
      const  dispenseSemestral = [];
     const  dispenseTrimestral = [];
     const  dispenseMensal =  [];
     const allDispenses = DispenseService.getDispensesByYearAndDistrictAndClinicAndPharmacyFromLocalStorage(yearAnnualPeriod.value,district,clinic,pharmacy);
       let resultDispenses1 = groupedMap(allDispenses , 'patientid')
       const mapIter = resultDispenses1.values()
     console.log(mapIter)
       for (const item of mapIter) {
           const firstItem = item[0]
           // console.log(firstItem)
           dispenseToRegime.push(firstItem)
           if(firstItem.dispensatrimestral === 1) dispenseTrimestral.push(firstItem)
            if(firstItem.dispensasemestral === 1) dispenseSemestral.push(firstItem)
            if(firstItem.dispensasemestral === 0 && firstItem.dispensatrimestral === 0) dispenseMensal.push(firstItem)
         }
           let result = groupedMap(dispenseToRegime , 'regimenome')
             const activesTotal = []
          activesTotal.push(dispenseSemestral.length)
          activesTotal.push(dispenseTrimestral.length)
               activesTotal.push(dispenseMensal.length)
       const keys = Array.from(result.keys())
       series2.series2 = []
       keys.forEach( (key) => {
         const keys = organizeDispensesByMonth(result.get(key))
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
         chartOptionsRegimeType.colors.push(color)
         series2.series2.push(
            {
          name: key,
          data: [...regimeType],
        },
         )
       })
         series1.series1 = activesTotal;
   }
 
});

   const organizeDispensesByMonth = (list) =>
  {
      var monthsPresent = []
   const map = list.reduce((a, b) => {
  const m = toDateStr(b.dispensedate).getMonth()
  // const m = DashboardUtils.getStatisticMonthByDate(b.dispensedate)
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
<style lang="scss" scoped>

.panel {
  border: 1px solid $grey-13;
    border-radius: 15px;
    background-color: white;
  }
</style>