<template>
  <q-page class="q-pa-sm q-gutter-sm">
    <q-dialog
      v-model="show_dialog"
      transition-show="flip-up"
      transition-hide="flip-up"
      persistent
    >
      <q-card style="width: 1100px; max-width: 90vw">
        <q-card-section>
          <div class="text-h7 text-left">
            <span
              ><q-img src="/icons/patient.jpeg" height="20px" width="20px"
            /></span>
            <span> Jhon Doo</span> | <span> Masculino</span> |
            <span> 23 anos de idade</span>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="text-h5 text-center">Atenção Farmacéutica</div>
        </q-card-section>

        <q-separator />
        <q-card-section class="scroll" style="max-height: 80vh">
          <q-form class="q-gutter-md">
            <div class="q-mx-lg">
              <div class="q-mt-lg">
                <div class="row q-mt-md">
                  <div class="text-left text-h7 bold q-ml-md q-pa-md">
                    <q-input
                      dense
                      outlined
                      style="width: 350px"
                      v-model="visitDate"
                      ref="data"
                      :disable="this.editMode"
                      label="Data da Consulta"
                    >
                    </q-input>
                  </div>
                  <div class="q-mx-lg" style="width: 1500px">
                    <div class="q-pa-md">
                      <!--q-btn
                        label="Reset"
                        push
                        color="white"
                        text-color="primary"
                        @click="step = 1"
                        class="q-mb-md"
                      /-->

                      <q-stepper
                        v-model="step"
                        header-nav
                        ref="stepper"
                        color="primary"
                        animated
                      >
                        <q-step
                          :name="1"
                          title="Dados Vitais"
                          icon="settings"
                          :done="step > 1"
                          :header-nav="step > 1"
                        >
                          <q-separator />
                          <div class="q-pa-md">
                            <q-markup-table
                              :separator="separator"
                              flat
                              bordered
                            >
                              <tbody>
                                <strong>Dados Vitais</strong>
                                <tr>
                                  <td class="text-left">Altura</td>
                                  <td class="text-left">
                                    {{ clinicInformation.height }} [Cm]
                                  </td>
                                </tr>
                                <tr>
                                  <td class="text-left">Peso</td>
                                  <td class="text-left">
                                    {{ clinicInformation.weight }} [Kg]
                                  </td>
                                </tr>
                                <tr>
                                  <td class="text-left">IMC</td>
                                  <td class="text-left">
                                    {{ clinicInformation.imc }}
                                  </td>
                                </tr>

                                <strong>Dados Vitais</strong>
                                <tr>
                                  <td class="text-left">Sistole</td>
                                  <td class="text-left">
                                    {{ clinicInformation.systole }} [mmHg]
                                  </td>
                                </tr>
                                <tr>
                                  <td class="text-left">Diastole</td>
                                  <td class="text-left">
                                    {{ clinicInformation.distort }} [mmHg]
                                  </td>
                                </tr>
                              </tbody>
                            </q-markup-table>
                          </div>

                          <q-stepper-navigation>
                            <q-btn
                              @click="
                                () => {
                                  done1 = true;
                                  step = 2;
                                }
                              "
                              color="primary"
                              label="Continue"
                            />
                          </q-stepper-navigation>
                        </q-step>

                        <q-step
                          :name="2"
                          title="Rastreio TB"
                          icon="create_new_folder"
                          :done="step > 2"
                          :header-nav="step > 2"
                        >
                          <q-markup-table :separator="separator" flat bordered>
                            <thead style="background: #e5e5e5">
                              <tr>
                                <th class="text-left">
                                  Perguntas de rastreio de tuberculose
                                </th>
                                <th class="text-left">Sim</th>
                                <th class="text-left">Não</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td class="text-left">
                                  Está actualmente em tratamento profilático com
                                  isoniazida (TPI)
                                </td>
                                <td class="text-left">
                                  <q-radio v-model="tpi" val="true" />
                                </td>
                                <td class="text-left">
                                  <q-radio v-model="tpi" val="false" />
                                </td>
                              </tr>

                              <tr>
                                <td class="text-left">
                                  Está em tratamento de tuberculose (TB)
                                </td>
                                <td class="text-left">
                                  <q-radio v-model="tb" val="true" />
                                </td>
                                <td class="text-left">
                                  <q-radio v-model="tb" val="false" />
                                </td>
                              </tr>
                            </tbody>
                          </q-markup-table>

                          <q-markup-table :separator="separator" flat bordered>
                            <thead style="background: #e5e5e5">
                              <tr>
                                <th class="text-left">
                                  Sinais e sintomas sugestivos a TB
                                </th>
                                <th class="text-left">Sim</th>
                                <th class="text-left">Não</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td class="text-left">
                                  Está com tosse a duas semanas
                                </td>
                                <td class="text-left">
                                  <q-radio v-model="cough" val="true" />
                                </td>
                                <td class="text-left">
                                  <q-radio v-model="cough" val="false" />
                                </td>
                              </tr>

                              <tr>
                                <td class="text-left">
                                  Esteve febre nas últimas duas semanas
                                </td>
                                <td class="text-left">
                                  <q-radio v-model="fever" val="true" />
                                </td>
                                <td class="text-left">
                                  <q-radio v-model="fever" val="false" />
                                </td>
                              </tr>

                              <tr>
                                <td class="text-left">
                                  Perdeu peso >1.5 Kg no último mês
                                </td>
                                <td class="text-left">
                                  <q-radio v-model="weight" val="true" />
                                </td>
                                <td class="text-left">
                                  <q-radio v-model="weight" val="false" />
                                </td>
                              </tr>

                              <tr>
                                <td class="text-left">
                                  Tem suado muito a noite
                                </td>
                                <td class="text-left">
                                  <q-radio v-model="sweat" val="true" />
                                </td>
                                <td class="text-left">
                                  <q-radio v-model="sweat" val="false" />
                                </td>
                              </tr>

                              <tr>
                                <td class="text-left">
                                  Teve cansaço ou fadiga nas últimas duas
                                  semanas
                                </td>
                                <td class="text-left">
                                  <q-radio v-model="tiredness" val="true" />
                                </td>
                                <td class="text-left">
                                  <q-radio v-model="tiredness" val="false" />
                                </td>
                              </tr>

                              <tr>
                                <td class="text-left">
                                  Tem um parente em casa que está a fazer
                                  tratamento de TB
                                </td>
                                <td class="text-left">
                                  <q-radio v-model="parent" val="true" />
                                </td>
                                <td class="text-left">
                                  <q-radio v-model="parent" val="false" />
                                </td>
                              </tr>
                            </tbody>
                          </q-markup-table>

                          <q-stepper-navigation>
                            <q-btn
                              @click="
                                () => {
                                  done2 = true;
                                  step = 3;
                                }
                              "
                              color="primary"
                              label="Continue"
                            />
                            <q-btn
                              flat
                              @click="step = 1"
                              color="primary"
                              label="Back"
                              class="q-ml-sm"
                            />
                          </q-stepper-navigation>
                        </q-step>

                        <q-step
                          :name="3"
                          title="Rastreio Gravidez"
                          icon="create_new_folder"
                          :done="step > 3"
                          :header-nav="step > 3"
                        >
                          {{ clinicInformation.weight }}

                          <q-stepper-navigation>
                            <q-btn
                              @click="
                                () => {
                                  done3 = true;
                                  step = 4;
                                }
                              "
                              color="primary"
                              label="Continue"
                            />
                            <q-btn
                              flat
                              @click="step = 2"
                              color="primary"
                              label="Back"
                              class="q-ml-sm"
                            />
                          </q-stepper-navigation>
                        </q-step>

                        <q-step
                          :name="4"
                          title="Monitoria e
                          Reforço a Adesão"
                          icon="add_comment"
                          :header-nav="step > 4"
                        >
                          {{ clinicInformation.height }}

                          <q-stepper-navigation>
                            <q-btn
                              @click="
                                () => {
                                  done4 = true;
                                  step = 5;
                                }
                              "
                              color="primary"
                              label="Continue"
                            />
                            <q-btn
                              flat
                              @click="step = 3"
                              color="primary"
                              label="Back"
                              class="q-ml-sm"
                            />
                          </q-stepper-navigation>
                        </q-step>

                        <q-step
                          :name="5"
                          title="Reações Adversas"
                          icon="add_comment"
                          :header-nav="step > 5"
                        >
                          {{ clinicInformation.height }}

                          <q-stepper-navigation>
                            <q-btn
                              color="primary"
                              @click="done5 = true"
                              label="Finish"
                            />
                            <q-btn
                              flat
                              @click="step = 4"
                              color="primary"
                              label="Back"
                              class="q-ml-sm"
                            />
                          </q-stepper-navigation>
                        </q-step>
                      </q-stepper>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-form>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn
            v-close-popup
            color="negative"
            label="Cancelar"
            type="reset"
            @click="close"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script setup>
/*
imports
*/

import { onMounted } from '@vue/runtime-core';
import { reactive, ref } from 'vue';
/*
  Props
*/
const props = defineProps({
  close: {
    type: Function,
  },
  show_dialog: {
    type: Boolean,
  },
  clinicInformation: {
    type: Object,
  },
});

/*
Declarations
*/
const step = reactive(ref(1));
const tpi = ref(props.clinicInformation.istreatmenttpi.toString());
const tb = ref(props.clinicInformation.istreatmenttb.toString());
const weight = ref(props.clinicInformation.islostweight.toString());
const fever = ref(props.clinicInformation.isfever.toString());
const cough = ref(props.clinicInformation.iscough.toString());
const sweat = ref(props.clinicInformation.issweeting.toString());
const tiredness = ref(
  props.clinicInformation.hasfatigueortiredneslasttwoweeks.toString()
);
const parent = ref(props.clinicInformation.hasparenttbtreatmement.toString());

/*
  Methods
*/

onMounted(() => {
  console.log('Teste..', props.clinicInformation);
});
</script>
