<template>
  <div class="q-pa-md q-pt-xl">
    <q-splitter v-model="splitterModel">
      <template v-slot:before>
        <q-tabs
          v-model="selectedTab"
          vertical
          active-bg-color="white"
          active-color="primary"
          indicator-color="orange"
          class="text-grey"
        >
          <q-tab v-for="tab in tabs" :key="tab.name" v-bind="tab" />
        </q-tabs>
      </template>

      <template v-slot:after>
        <q-tab-panels
          v-model="selectedTab"
          animated
          swipeable
          vertical
          transition-prev="slide-down"
          transition-next="slide-up"
        >
          <q-tab-panel name="clinic">
            <div class="text-h4 q-mb-md"></div>
            <clinics> </clinics>
          </q-tab-panel>
          <!--q-tab-panel name="clinic_sector">
            <div class="text-h4 q-mb-md"></div>
            <clinicSectors> </clinicSectors>
          </!--q-tab-panel>
          <q-tab-panel name="doctor">
            <div class="text-h4 q-mb-md"></div>
            <doctor> </doctor>
          </q-tab-panel>
          <q-tab-panel name="drugs">
            <div class="text-h4 q-mb-md"></div>
            <drug> </drug>
          </q-tab-panel>
          <q-tab-panel name="clinical_service">
            <div class="text-h4 q-mb-md"></div>
            <clinicalServices> </clinicalServices>
          </q-tab-panel>
          <q-tab-panel name="therapeutic_regimen">
            <div class="text-h4 q-mb-md"></div>
            <therapeuticRegimen> </therapeuticRegimen>
          </q-tab-panel>
          <q-tab-panel name="identifier_type">
            <div class="text-h4 q-mb-md"></div>
            <identifierType />
          </q-tab-panel>
          <q-tab-panel-- name="interoperability">
            <div class="text-h4 q-mb-md"></div>
            <interoperability> </interoperability>
          </q-tab-panel-->
        </q-tab-panels>
      </template>
    </q-splitter>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import clinics from '../Clinic/Clinic.vue';

const selectedTab = ref('clinic');
const splitterModel = ref(15);
const tabs = [
  // { name: 'national_clinic', icon: 'local_convenience_store', label: 'Unidade Sanitaria' },
  { name: 'clinic', icon: 'local_hospital', label: 'Farmácias' },
  { name: 'clinic_sector', icon: 'local_pharmacy', label: 'Sector Clínico' },
  { name: 'drugs', icon: 'medication', label: 'Medicamentos' },
  { name: 'therapeutic_regimen', icon: 'healing', label: 'Regime Terapêutico' },
];
</script>
<style></style>
