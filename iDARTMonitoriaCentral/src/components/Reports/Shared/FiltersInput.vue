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

                    <div class="">
                      <q-btn class="gt-xs"
                        :color="!processingTerminated ? 'green-6' : 'grey-6'"
                        :disable="processingTerminated"
                        dense
                        rounded
                        icon="chevron_right"
                        @click.stop="processReport()"
                      >
                        <q-tooltip class="bg-primary">Processar o Relatório</q-tooltip>
                      </q-btn>
                    </div>
                    <div class="q-mr-md q-pt-xs items-center" style="width: 250px;">
                      <q-linear-progress class="col q-mx-md" size="25px" stripe rounded :value="this.progress" color="red">
                        <div class="absolute-full flex flex-center">
                            <q-badge color="white" text-color="accent" :label="progressLabel1" />
                        </div>
                      </q-linear-progress>
                    </div>
              </div>

              <div class="row q-ml-md">
                <div class="col">
                  <q-btn :color="processingTerminated ? 'green-6' : 'grey-6'" class="row gt-xs" flat dense icon="article" :disable="!processingTerminated" @click.stop="generateReport('XLS')">
                    <q-tooltip class="bg-primary">Imprimir Excel</q-tooltip>
                    .Xls
                </q-btn>
                <q-btn :color="processingTerminated ? 'green-6' : 'grey-6'" class="gt-xs" flat dense  @click.stop="generateReport('PDF')" :disable="!processingTerminated" icon="article" title=".pdf">
                  <q-tooltip class="bg-primary">Imprimmir Pdf</q-tooltip>
                  .Pdf
                  </q-btn>
                </div>
              </div>
            </div>
</template>

<script setup>

</script>

<style>
    .fild-radius {
        border-radius: 5px;
    }
</style>
