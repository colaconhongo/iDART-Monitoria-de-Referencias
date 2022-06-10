<template>
             <div class="row">
              <div class="col row q-pt-md">
                    <q-select
                      class="col q-mr-md"
                      style="max-width: 300px"
                      dense outlined
                      :options="periodTypeList"
                      ref="period"
                      option-value="code"
                      option-label="description"
                      v-model="params.periodType"
                      :rules="[ val => ( val != null) || ' Por favor indique o período']"
                      lazy-rules
                      @blur="onPeriodoChange()"
                      label="Período *" />

                     <div
                      class="row col q-mb-md"
                      v-if="isSpecificSearch" >
                        <q-input
                          dense
                          outlined
                          :disable="false"
                          class="col q-mr-md"
                          v-model="params.startDate"
                          label="Data Início">
                          <template v-slot:append>
                              <q-icon name="event" class="cursor-pointer">
                              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                  <q-date mask="DD-MM-YYYY" v-model="params.startDate">
                                  <div class="row items-center justify-end">
                                      <q-btn v-close-popup label="Close" color="primary" flat />
                                  </div>
                                  </q-date>
                              </q-popup-proxy>
                              </q-icon>
                          </template>
                        </q-input>
                        <q-input
                          dense
                          outlined
                          :disable="false"
                          class="col q-mr-md"
                          v-model="params.endDate"
                          label="Data Fim">
                          <template v-slot:append>
                              <q-icon name="event" class="cursor-pointer">
                              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                  <q-date
                                    mask="DD-MM-YYYY"
                                    v-model="params.endDate"
                                   :options="blockDataFutura">
                                  <div class="row items-center justify-end">
                                      <q-btn v-close-popup label="Close" color="primary" flat />
                                  </div>
                                  </q-date>
                              </q-popup-proxy>
                              </q-icon>
                          </template>
                        </q-input>
                    </div>

                    <MonthlyPeriod class="col" v-if="isMonthlSearch" />

                    <QuarterlyPeriod class="col" v-if="isSTrimestralSearch" />

                    <SemesterPeriod class="col" v-if="isSemestralSearch"  />

                    <AnnualPeriod v-if="isAnnualSearch" />

              </div>

              <div class="row q-ml-md">
                <div class="col">
                  <q-btn class="row gt-xs" flat dense icon="article"  @click.stop="generateReport('XLS')">
                    <q-tooltip class="bg-primary">Imprimir Excel</q-tooltip>
                    .Xls
                </q-btn>
                <q-btn class="gt-xs" flat dense  @click.stop="generateReport('PDF')" icon="article" title=".pdf">
                  <q-tooltip class="bg-primary">Imprimmir Pdf</q-tooltip>
                  .Pdf
                  </q-btn>
                </div>
              </div>
            </div>
</template>

<script setup>
  /*
  Imports
  */
 import { ref, reactive, provide, computed, inject, toRaw } from 'vue';
 import MonthlyPeriod from 'src/components/Reports/Shared/MonthlyPeriod.vue'
 import QuarterlyPeriod from 'src/components/Reports/Shared/QuarterlyPeriod.vue'
 import SemesterPeriod from 'src/components/Reports/Shared/SemesterPeriod.vue'
 import AnnualPeriod from 'src/components/Reports/Shared/AnnualPeriod.vue'
 import { alert } from 'src/components/Shared/Directives/Plugins/Dialog/dialog';
 import moment from 'moment'
  /*
  Declaration
  */
 const province = inject('province');
 const district = inject('district');
 const facility = inject('facility');
 const pharmacy = inject('pharmacy');

 const periodTypeList = ref([
                            { id: 1, description: 'Especifico', code: 'SPECIFIC' },
                            { id: 2, description: 'Mensal', code: 'MONTH' },
                            { id: 3, description: 'Trimestral', code: 'QUARTER' },
                            { id: 4, description: 'Semestral', code: 'SEMESTER' },
                            { id: 5, description: 'Anual', code: 'ANNUAL' }
                          ]);

  let params = reactive(ref({
                      id: null,
                      provinceId: null,
                      districtId: null,
                      clinicId: null,
                      facility: facility.value,
                      clinic: pharmacy,
                      province: province.value,
                      district: district,
                      endDate: null,
                      startDate: null,
                      year: new Date().getFullYear(),
                      period: null,
                      periodTypeView: null,
                      periodType: null,
                      fileType: null
                    }))
  /*
  Computed
  */
 const isSpecificSearch = computed(() => {
    if (params.value.periodType === null) return false
    return params.value.periodType.code === 'SPECIFIC'
  });

  const isMonthlSearch = computed(() => {
    if (params.value.periodType === null) return false
    return params.value.periodType.code === 'MONTH'
  });

  const isSTrimestralSearch = computed(() => {
    if (params.value.periodType === null) return false
    return params.value.periodType.code === 'QUARTER'
  });

  const isSemestralSearch = computed(() => {
    if (params.value.periodType === null) return false
    return params.value.periodType.code === 'SEMESTER'
  });

  const isAnnualSearch = computed(() => {
    if (params.value.periodType === null) return false
    return params.value.periodType.code === 'ANNUAL'
  });
  /*
  Methods
  */
 const generateReport = (fileType) => {
   params.value.fileType = fileType
   if (params.value.period === null || params.value.period === undefined) {
     alert(
          'Alerta!',
          'Por favor indicar o período a analisar!',
          null,
          null,
          null
        );
   } else {
      determineDateInterval()
    emit('generateReport', params)
   }
 }

 const determineDateInterval = () => {
   if (isMonthlSearch.value) {
     params.value.endDate = moment(params.value.year +'-'+ params.value.period.id +'-'+ 20, 'YYYY-MM-DD')
     params.value.startDate = Object.assign({}, params.value.endDate)
     params.value.startDate = moment(params.value.startDate).subtract(30, 'days');
     params.value.startDate = moment(params.value.startDate).set('date', 21);
   } else if (isSTrimestralSearch.value) {
     if (params.value.period.id === 1) {
       params.value.startDate = moment(params.value.year - 1 +'-12-'+ 21, 'YYYY-MM-DD')
       params.value.endDate = moment(params.value.year +'-03-'+ 20, 'YYYY-MM-DD')
     } else if (params.value.period.id === 2) {
       params.value.startDate = moment(params.value.year +'-03-'+ 21, 'YYYY-MM-DD')
       params.value.endDate = moment(params.value.year +'-06-'+ 20, 'YYYY-MM-DD')
     } else if (params.value.period.id === 3) {
       params.value.startDate = moment(params.value.year +'-06-'+ 21, 'YYYY-MM-DD')
       params.value.endDate = moment(params.value.year +'-09-'+ 20, 'YYYY-MM-DD')
     } else if (params.value.period.id === 4) {
       params.value.startDate = moment(params.value.year +'-09-'+ 21, 'YYYY-MM-DD')
       params.value.endDate = moment(params.value.year +'-12-'+ 20, 'YYYY-MM-DD')
     }
   } else if (isSemestralSearch.value) {
     if (params.value.period.id === 1) {
       params.value.startDate = moment(params.value.year - 1 +'-12-'+ 21, 'YYYY-MM-DD')
       params.value.endDate = moment(params.value.year +'-06-'+ 20, 'YYYY-MM-DD')
     } else if (params.value.period.id === 2) {
       params.value.startDate = moment(params.value.year +'-06-'+ 21, 'YYYY-MM-DD')
       params.value.endDate = moment(params.value.year +'-12-'+ 20, 'YYYY-MM-DD')
     }
   } else if (isAnnualSearch.value) {
       params.value.startDate = moment(params.value.year - 1 +'-12-'+ 21, 'YYYY-MM-DD')
       params.value.endDate = moment(params.value.year +'-12-'+ 20, 'YYYY-MM-DD')
   }else {
       params.value.startDate = moment(params.value.startDate, 'DD-MM-YYYY')
       params.value.endDate = moment(params.value.endDate +'-12-'+ 20, 'DD-MM-YYYY')
   }
 }

 const onPeriodoChange = () => {
      params.startDate = null
      params.endDate = null
      params.period = null
    }

 const emit = defineEmits(['generateReport'])

 provide('params', params)
</script>

<style>
    .fild-radius {
        border-radius: 5px;
    }
</style>
