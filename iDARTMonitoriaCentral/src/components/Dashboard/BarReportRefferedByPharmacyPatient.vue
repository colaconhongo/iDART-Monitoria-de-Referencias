<template>
<div style="width: 100%; height: 100%;linear-gradient( 135deg, #343E59 10%, #2B2D3E 40%)" class="panel">
 <apexchart
      width="95%"
      height="600px"
      type="bar"
      :options="chartOptionsReferredByPharmacy"
      :series="series4.series4"
    ></apexchart>
    </div>
</template>

<script setup>
import VueApexCharts from 'vue3-apexcharts';
import randomcolor from 'randomcolor';
import {  reactive , watch , inject } from 'vue';
import patientService from 'src/services/patientService/patientService';
import ClinicService from 'src/services/clinicService/clinicService';
 import DashboardUtils from '../../use/DashboardUtils';
 const monthsX = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEC']
const apexchart = VueApexCharts;

const chartOptionsReferredByPharmacy = {
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
         title: {
          text: 'Total de Referidos Por Farmacia',
          align: 'center',
          style: {
            color: '#000000'
          }
          },
         plotOptions: {
              bar: {
                borderRadius: 10,
              }
           },
            dataLabels: {
          enabled: false,
          position : top
        },
      };

 let series4 = reactive({
  series4 : [
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
const yearAnnualPeriod = inject('year')
const district = inject('district')
const pharmacy = inject('pharmacy')


watch(props.loaded, () => {
  console.log(props.loaded)
   if(props.loaded) {
     let patients = patientService.getPatientsByYearAndDistrictAndClinicAndPharmacyFromLocalStorage(yearAnnualPeriod.value,district,pharmacy);
    let resultPatientsByClinicUuid = groupedMap(patients , 'clinicuuid')
       let resultPatientsByPatientId = groupedMap(patients , 'patientid')
            
              // refferal by pharmacy
   const keysByPharm = Array.from(resultPatientsByClinicUuid.keys())
      series4.series4 = []
       keysByPharm.forEach( (key) => {
         const pharm = ClinicService.getPharmByUUid(key)
         const keys = DashboardUtils.organizeRefferedPatientsByMonth(resultPatientsByClinicUuid.get(key))
         const regimeType = []
         if(pharm.length !== 0) { 
            if (keys !== undefined) {
       const mapIter = keys.values()
       for (const item of mapIter) {
         regimeType.push(item.data)
         }
         }
          
                   const color = randomcolor();// a hex code for an attractive color
                 //  item.style = 'background-color:' + color + ';' + 'color: ##ffffff'
         chartOptionsReferredByPharmacy.colors.push(color)
          //series4.series4 = []
         series4.series4.push(
            {
          name: pharm[0].clinicname,
          data: [...regimeType],
        },
         )
         }
       })
   }
 
});


const groupedMap  = (items, key) => items.reduce(
    (entryMap, e) => entryMap.set(e[key], [...entryMap.get(e[key])||[], e]),
    new Map()
);
</script>
<style lang="scss" scoped>

.panel {
    border-radius: 15px;
    background-color: white;
  }
</style>
