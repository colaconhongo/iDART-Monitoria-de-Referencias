<template>
  <div>

        <div class="row">
          <div class="col-3   q-ml-sm q-mr-sm">
              <q-bar dark class="bg-primary text-white">
                  <div class="col text-center text-weight-bold">
                   Listagens
                  </div>
            </q-bar>
          </div>
          <div class="col q-mr-sm">
                   <q-bar dark class="bg-primary text-white">
                  <div class="col text-center text-weight-bold">
                   Resultados
                  </div>
            </q-bar>
          </div>
        </div>

        <div class="row">
          <div class="col-3  q-ml-sm q-mr-sm panel">
            <ListReportMenu
              @changeTab="changeTab"
            />

          </div>
          <div class="col q-mr-sm panel q-pa-sm">
        <template v-for="comp in components" :key="comp.id" >
           <component
              :is="comp.name"
              :id="comp.id"
              class="q-mb-sm"
              />
        </template>
          </div>
        </div>
  </div>
</template>

<script setup>
/*
  Imports
  */
import ListReportMenu from 'src/components/Reports/Menu/ListReportMenu.vue'
import { uid } from 'quasar'

let components = []
  /*
  Methods
  */
 const changeTab = (tabName) => {
        const uidValue = 'report' + uid()
        const comp = { id: uidValue, name: tabName }
        components.push(comp)
      }
</script>

<style lang="scss" scoped>
.panel {
    border: 1px solid $grey-13;
    border-radius: 0px
  }
</style>
