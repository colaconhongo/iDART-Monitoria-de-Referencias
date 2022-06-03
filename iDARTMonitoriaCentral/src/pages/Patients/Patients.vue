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
          <q-tab-panel name="clinicInformation">
            <div class="text-h4 q-mb-md"></div>
            <clinicInformations />
          </q-tab-panel>

          <q-tab-panel name="prescription">
            <div class="text-h4 q-mb-md"></div>
            <prescriptions />
          </q-tab-panel>

          <q-tab-panel name="dispense">
            <div class="text-h4 q-mb-md"></div>
            <dispenses />
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import clinicInformations from '../ClinicInformation/ClinicInformation.vue';
import prescriptions from '../ClinicInformation/Prescription.vue';
import dispenses from '../ClinicInformation/Dispense.vue';

const selectedTab = ref('clinicInformation');
const splitterModel = ref(15);
const tabs = [
  {
    name: 'clinicInformation',
    icon: 'local_pharmacy',
    label: 'Atenção Farmacéutica',
  },
  { name: 'prescription', icon: 'medication', label: 'Prescrições' },
  { name: 'dispense', icon: 'medication', label: 'Dispensas' },
];
</script>
<style></style>
