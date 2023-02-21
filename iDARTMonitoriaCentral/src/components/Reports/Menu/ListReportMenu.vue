<template>
  <div>
    <div class="q-pa-xs" style="max-width: 1000px">
      <q-list separator>
        <q-item
          v-for="men in menu"
          :key="men.tabName"
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
import { ref } from 'vue';
/*
  Declarations
*/
const menu = ref([
  {
    description: 'Lista de Pacientes Referidos para outras Farmácias',
    tabName: 'ReferedPatientsList',
  },
  {
    description: 'Lista de Pacientes que Voltaram da Referência',
    tabName: 'ReturnedReferedPatient',
  },
  {
    description: 'Lista de Pacientes Faltosos ao Levantamento',
    tabName: 'PatientsWithMissDispenses',
  },
  {
    description: 'Histórico de Levantamentos de Pacientes Referidos',
    tabName: 'PatientDispenseHistory',
  },
  { description: 'Lista de Pacientes Activos', tabName: 'ActivePatientList' },
  {
    description: 'Lista de Dispensas por Frasco e Regime',
    tabName: 'DispenseByDrugAndRegimen',
  },
  {
    description: 'Lista de Pacientes com Atenção Farmaceutica',
    tabName: 'PatientWithScreeningList',
  },
  {
    description: 'Lista de Dispensas que não Foram Sincronizadas',
    tabName: 'NotSyncDispenses',
  },
]);

const menuResearch = ref([
  {
    description: 'Listar pacientes activos na farmácia (Modelo DDD)',
    tabName: 'ActivePatientDDDModel',
  },
  {
    description: 'Listar pacientes inactivos na farmácia (Modelo DDD)',
    tabName: '',
  },
  {
    description: 'Número de pacientes Inscritos em DDD',
    tabName: 'EnrolledPatientIndicator',
  },
]);

/*
      Emits
    */
const emit = defineEmits(['changeTab']);
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
