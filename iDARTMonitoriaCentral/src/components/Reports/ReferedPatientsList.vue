<template>
<div ref="filterDrugStoreSection">
  <Bar
    :addVisible="false"
    :mainContainer="true"
    :closeVisible="true"
    @closeSection="closeSection"
    bgColor="bg-orange-5"> {{title}}
  </Bar>
  <div class="param-container">
    <q-item>
        <q-item-section  class="col" >
          <FiltersInput />
        </q-item-section>
    </q-item>
  </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import FiltersInput from 'src/components/Reports/Shared/FiltersInput.vue'
import Bar from 'src/components/Shared/Bar.vue'

const title = ref('Lista de Pacientes Referidos para Outras Farmácias')

</script>

<style lang="scss" scoped>
  .param-container {
    border-bottom: 1px dashed $grey-13;
    border-left: 1px dashed $grey-13;
    border-right: 1px dashed $grey-13;
    border-radius: 0px 0px 5px 5px;
  }
</style>
