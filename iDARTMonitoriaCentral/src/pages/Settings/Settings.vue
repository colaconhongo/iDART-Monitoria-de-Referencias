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
            <clinics />
          </q-tab-panel>
          <q-tab-panel name="clinic_sector">
            <div class="text-h4 q-mb-md"></div>
            <clinic_sector />
          </q-tab-panel>
          <q-tab-panel name="drugs">
            <div class="text-h4 q-mb-md"></div>
            <drugs />
          </q-tab-panel>
          <q-tab-panel name="regimen">
            <div class="text-h4 q-mb-md"></div>
            <regimen />
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import clinics from '../Clinic/Clinic.vue';
import clinic_sector from '../ClinicSector/ClinicSector.vue';
import drugs from '../Drug/Drug.vue';
import regimen from '../Regimen/Regimen.vue';

const { t } = useI18n();
const selectedTab = ref('clinic');
const splitterModel = ref(15);
const tabs = [
  { name: 'clinic', icon: 'local_hospital', label: t('pharmacy') },
  { name: 'clinic_sector', icon: 'local_pharmacy', label: t('clinicSector') },
  { name: 'drugs', icon: 'medication', label: t('drug') },
  { name: 'regimen', icon: 'healing', label: t('regimen') },
];
</script>
<style></style>
