<template>
             <div class="row">
              <div class="col row q-pt-md">

                    <q-select
                      class="col q-mr-md"
                      v-if="isProvincialLevel"
                      dense outlined
                      :options="districts"
                      ref="district"
                      option-value="id"
                      option-label="description"
                      label="Distrito" />

                    <q-select
                      class="col q-mr-md"
                      dense outlined
                      :disable="isClinicLevel"
                      :options="clinics"
                      ref="clinic"
                      option-value="id"
                      option-label="clinicName"
                      label="Farmácia" />

                    <q-select
                      class="col q-mr-md"
                      dense outlined
                      :options="periodTypeList"
                      ref="period"
                      option-value="code"
                      option-label="description"
                      @update:model-value="val => onPeriodoChange(val)"
                      :rules="[ val => ( val != null) || ' Por favor indique o período']"
                      lazy-rules
                      label="Período *" />

                     <div  class="row q-mb-md" >
                        <q-input
                          dense
                          outlined
                          :disable="false"
                          class="col q-mr-md"
                          label="Data Início">
                          <template v-slot:append>
                              <q-icon name="event" class="cursor-pointer">
                              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                  <q-date mask="DD-MM-YYYY">
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
                          label="Data Fim">
                          <template v-slot:append>
                              <q-icon name="event" class="cursor-pointer">
                              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                  <q-date
                                  mask="DD-MM-YYYY"
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

                    <MonthlyPeriod
                      @setSelectedMonth="setSelectedPeriod"
                      @setSelectedYearMonth="setSelectedYear"/>

                    <QuarterlyPeriod
                      @setSelectedQuarter="setSelectedPeriod"
                      @setSelectedYearQuarter="setSelectedYear" />

                    <SemesterPeriod
                      @setSelectedSemester="setSelectedPeriod"
                      @setSelectedSemesterYear="setSelectedYear"  />

                    <AnnualPeriod
                      @setSelectedYearAnnual="setSelectedYear" />

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
 import { ref } from 'vue';
  /*
  Declaration
  */
  let params = ref({
                      id: null,
                      provinceId: null,
                      districtId: null,
                      clinicId: null,
                      clinic: null,
                      province: null,
                      district: null,
                      endDateParam: null,
                      startDateParam: null,
                      year: new Date().getFullYear(),
                      period: null,
                      periodTypeView: null,
                      fileType: null
                    })
  /*
  Methods
  */
 const generateReport = (fileType) => {
   params.value.fileType = fileType
   emit('generateReport', params)
 }

 const emit = defineEmits(['generateReport'])
</script>

<style>
    .fild-radius {
        border-radius: 5px;
    }
</style>
