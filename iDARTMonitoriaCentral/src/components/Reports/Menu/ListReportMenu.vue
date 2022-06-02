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
          <q-item-section class="text-grey-10">{{ men.description }}</q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
/*
  Declarations
*/
    const menu = ref([
              { description: 'Lista de Pacientes Referidos para outras Farmácias', tabName: 'ReferedPatientsList' },
              { description: 'Lista de Pacientes que Voltaram da Referência', tabName: 'ReturnedReferedPatient' },
              { description: 'Lista de Pacientes Faltosos ao Levantamento', tabName: 'PatientsWithMissDispenses' },
              { description: 'Histórico de Levantamentos de Pacientes Referidos', tabName: 'PatientDispenseHistory' },
              { description: 'Lista de Pacientes Activos', tabName: 'ActivePatientList' },
              { description: 'Lista de Dispensas por Frasco e Regime', tabName: 'DispenseByDrugAndRegimen' },
              { description: 'Lista de Pacientes com Atenção Farmaceutica', tabName: 'PatientWithScreeningList' },
              { description: 'Lista de Dispensas que não Foram Sincronizadas', tabName: 'NotSyncDispenses' }
          ])
    /*
      Emits
    */
    const emit = defineEmits(['changeTab'])
    /*
      Methods
    */
    const changeTab = (tabName) => {
      emit('changeTab', tabName)
    }

</script>

<style lang="scss" scoped>
.menu-item {
  background: $light-blue-2;
}
</style>
