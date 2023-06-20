<template>
  <div>
    <div class="q-pa-xs" style="max-width: 1000px">
      <q-list v-for="men in menu" :key="men.tabName" separator>
        <q-item
          v-if="men.model.includes(selectedModel.abbreviation)"
          clickable
          class="menu-item q-mt-xs"
          @click="changeTab(men.tabName)"
        >
          <q-item-section class="text-grey-10">{{
            men.description
          }}</q-item-section>
        </q-item>
      </q-list>
      <q-expansion-item
        v-if="selectedModel.abbreviation === 'MDD'"
        expand-separator
        label="Indicadores de Pesquisa"
        class="menu-item q-mt-xs"
      >
        <q-list separator>
          <q-item
            v-for="menrh in menuResearch"
            :key="menrh.tabName"
            clickable
            class="menurh-item"
            @click="changeTab(menrh.tabName)"
          >
            <q-item-section class="text-grey-10 q-ml-md">{{
              menrh.description
            }}</q-item-section>
          </q-item>
        </q-list>
      </q-expansion-item>
    </div>
  </div>
</template>

<script setup>
import { inject, ref } from 'vue';
/*
  Declarations
*/
const menu = ref([
  {
    description: 'Lista de Pacientes Referidos para outras Farmácias',
    tabName: 'ReferedPatientsList',
    model: ['MDD'],
  },
  {
    description: 'Lista de Pacientes Referidos para Sectores Clinicos',
    tabName: 'ReferedPatientsClinicSectorList',
    model: ['MDC'],
  },
  {
    description: 'Lista de Pacientes que Voltaram da Referência',
    tabName: 'ReturnedReferedPatient',
    model: ['MDD'],
  },
  {
    description: 'Lista de Pacientes Faltosos ao Levantamento',
    tabName: 'PatientsWithMissDispenses',
    model: ['MDD'],
  },
  {
    description: 'Histórico de Levantamentos de Pacientes Referidos',
    tabName: 'PatientDispenseHistory',
    model: ['MDD'],
  },
  {
    description: 'Lista de Pacientes Activos',
    tabName: 'ActivePatientList',
    model: ['MDD'],
  },
  {
    description: 'Lista de Dispensas por Frasco e Regime',
    tabName: 'DispenseByDrugAndRegimen',
    model: ['MDD'],
  },
  {
    description: 'Lista de Pacientes com Atenção Farmaceutica',
    tabName: 'PatientWithScreeningList',

    model: ['MDD'],
  },
  {
    description: 'Lista de Dispensas que não Foram Sincronizadas',
    tabName: 'NotSyncDispenses',
    model: ['MDD'],
  },
]);

const menuResearch = ref([
  {
    description: 'Listar pacientes activos na farmácia (Modelo DDD)',
    tabName: 'ActivePatientDDDModel',
    model: ['MDD'],
  },
  {
    description: 'Listar pacientes inactivos na farmácia (Modelo DDD)',
    tabName: 'InactivePatientDDDModel',
    model: ['MDD'],
  },
  {
    description: 'Número de pacientes Inscritos em DDD',
    tabName: 'EnrolledPatientIndicator',
    model: ['MDD'],
  },
]);

/*
      Emits
    */
const emit = defineEmits(['changeTab']);
/*
Inject
*/
const selectedModel = inject('selectedModel');

/*
Computed
*/
/*
      Methods
    */
const changeTab = (tabName) => {
  emit('changeTab', tabName);
};
</script>

<style lang="scss" scoped>
.menu-item {
  background: $light-blue-2;
}
.menurh-item {
  background: rgb(235, 236, 199);
}
</style>
