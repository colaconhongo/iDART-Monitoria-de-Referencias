<template>
  <q-page class="q-pa-sm q-gutter-sm">
    <q-dialog
      v-model="show_dialog"
      transition-show="flip-up"
      transition-hide="flip-up"
      persistent
    >
      <q-card style="width: 1500px; max-width: 90vw">
        <q-card-section>
          <div class="text-h7 text-left">
            <span
              ><q-img src="/icons/patient.jpeg" height="20px" width="20px"
            /></span>
            <span class="q-ml-md">
              {{
                props.patient.firstnames + ' ' + props.patient.lastname
              }}</span
            >
            |
            <span>
              {{ props.patient.sex === 'F' ? 'Feminino' : 'Masculino' }}</span
            >
            |
            <span>
              {{ Math.abs(ageCalculator(props.patient.dateofbirth)) }}</span
            >
          </div>
        </q-card-section>
        <q-separator />
        <q-separator />
        <q-card-section class="scroll" style="max-height: 80vh">
          <q-form class="q-gutter-md">
            <div class="q-mx-lg">
              <div class="q-mt-lg">
                <div class="row q-mt-md">
                  <div class="text-left text-h7 bold q-ml-md q-pa-md">
                    <div style="font-size: 12pt">
                      <q-icon name="event" />

                      Data de registo:<strong>{{
                        clinicInformation !== undefined
                          ? clinicInformation.registerdate
                          : ''
                      }}</strong>
                    </div>
                  </div>
                  <div class="q-mx-lg" style="width: 1500px">
                    <div class="q-pa-md">
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
                          color="primary"
                          icon="settings"
                          :done="step > 1"
                          :header-nav="step > 1"
                        >
                          <q-separator />
                          <vitalDataComponent
                            :clinicInformation="clinicInformation"
                          />

                          <q-stepper-navigation>
                            <q-btn
                              @click="
                                () => {
                                  done1 = true;
                                  step = 2;
                                }
                              "
                              color="primary"
                              label="Próximo"
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
                          <tbComponent :clinicInformation="clinicInformation" />

                          <q-stepper-navigation>
                            <q-btn
                              flat
                              @click="step = 1"
                              color="primary"
                              label="Voltar"
                              class="q-ml-sm"
                            />
                            <q-btn
                              @click="
                                () => {
                                  done2 = true;
                                  step = 3;
                                }
                              "
                              color="primary"
                              label="Próximo"
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
                          <q-markup-table :separator="separator" flat bordered>
                            <thead style="background: #e5e5e5">
                              <tr>
                                <th class="text-left">
                                  Perguntas de rastreio de Gravidez
                                </th>
                                <th class="text-left">Sim</th>
                                <th class="text-left">Não</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td class="text-left">Está Grávida?</td>
                                <td class="text-left">
                                  <q-radio
                                    :disable="true"
                                    v-model="clinicInformation.ispregnant"
                                    val="true"
                                  />
                                </td>
                                <td class="text-left">
                                  <q-radio
                                    :disable="true"
                                    v-model="clinicInformation.ispregnant"
                                    val="false"
                                  />
                                </td>
                              </tr>

                              <tr>
                                <td class="text-left">
                                  Teve menstruação nos últimos meses
                                </td>
                                <td class="text-left">
                                  <q-radio
                                    :disable="true"
                                    v-model="
                                      clinicInformation.hashadmenstruationlasttwoweeks
                                    "
                                    val="true"
                                  />
                                </td>
                                <td class="text-left">
                                  <q-radio
                                    :disable="true"
                                    v-model="
                                      clinicInformation.hashadmenstruationlasttwoweeks
                                    "
                                    val="false"
                                  />
                                </td>
                              </tr>
                            </tbody>
                          </q-markup-table>

                          <q-stepper-navigation>
                            <q-btn
                              flat
                              @click="step = 2"
                              color="primary"
                              label="Voltar"
                              class="q-ml-sm"
                            />
                            <q-btn
                              @click="
                                () => {
                                  done3 = true;
                                  step = 4;
                                }
                              "
                              color="primary"
                              label="Próximo"
                            />
                          </q-stepper-navigation>
                        </q-step>

                        <q-step
                          :name="4"
                          title="Monitoria e
                          Reforço a Adesão"
                          icon="add_comment"
                          :done="step > 4"
                          :header-nav="step > 4"
                        >
                          <monitoringComponent
                            :clinicInformation="clinicInformation"
                          />

                          <q-stepper-navigation>
                            <q-btn
                              flat
                              @click="step = 3"
                              color="primary"
                              label="Voltar"
                              class="q-ml-sm"
                            />
                            <q-btn
                              @click="
                                () => {
                                  done4 = true;
                                  step = 5;
                                }
                              "
                              color="primary"
                              label="Próximo"
                            />
                          </q-stepper-navigation>
                        </q-step>

                        <q-step
                          :name="5"
                          title="Reações Adversas"
                          icon="add_comment"
                          :header-nav="step > 5"
                        >
                          <adverseReactionComponent
                            :clinicInformation="clinicInformation"
                          />

                          <q-stepper-navigation>
                            <q-btn
                              flat
                              @click="step = 4"
                              color="primary"
                              label="Voltar"
                              class="q-ml-sm"
                            />
                            <q-btn
                              v-close-popup
                              color="primary"
                              @click="close"
                              label="Terminar"
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

//import { onMounted, computed } from '@vue/runtime-core';
import { reactive, ref, watch, onMounted, computed, inject } from 'vue';
import tbComponent from 'src/components/clinicInformation/tbComponent.vue';
import monitoringComponent from 'src/components/clinicInformation/MonitoringComponent.vue';
import adverseReactionComponent from 'src/components/clinicInformation/AdverseReactionComponent.vue';
import vitalDataComponent from 'src/components/clinicInformation/VitalDataComponent.vue';
import moment from 'moment';
import { useUtils } from 'src/use/useUtils';

const { ageCalculator } = useUtils();

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
  patient: {
    type: Object,
  },
});

/*
Declarations
*/
const step = reactive(ref(1));
let show_dialog = inject('show_dialog');

let clinicInformation = reactive(props.clinicInformation);

watch(
  () => props.clinicInformation,
  (newCount) => {
    // clinicInformation.tpi = 'true'; //props.clinicInformation.istreatmenttpi.toString();
    clinicInformation.imc =
      props.clinicInformation.imc !== null
        ? props.clinicInformation.imc.toString()
        : '';
    clinicInformation.weight = props.clinicInformation.weight.toString();

    clinicInformation.height = props.clinicInformation.height.toString();

    clinicInformation.systole = props.clinicInformation.systole.toString();

    clinicInformation.distort = props.clinicInformation.distort.toString();

    clinicInformation.istreatmenttpi =
      props.clinicInformation.istreatmenttpi.toString();
    clinicInformation.istreatmenttb =
      props.clinicInformation.istreatmenttb.toString();

    clinicInformation.registerdate = moment(
      props.clinicInformation.registerdate
    ).format('DD-MM-YYYY');
    clinicInformation.islostweight =
      props.clinicInformation.islostweight.toString();
    clinicInformation.isfever = props.clinicInformation.isfever.toString();
    clinicInformation.iscough = props.clinicInformation.iscough.toString();
    clinicInformation.issweeting =
      props.clinicInformation.issweeting.toString();

    clinicInformation.hasfatigueortiredneslasttwoweeks =
      props.clinicInformation.hasfatigueortiredneslasttwoweeks.toString();

    clinicInformation.hashadmenstruationlasttwoweeks =
      props.clinicInformation.hashadmenstruationlasttwoweeks.toString();

    clinicInformation.ispregnant =
      props.clinicInformation.ispregnant.toString();
    clinicInformation.haspatientcamecorrectdate =
      props.clinicInformation.haspatientcamecorrectdate.toString();

    clinicInformation.hasparenttbtreatmement =
      props.clinicInformation.hasparenttbtreatmement.toString();

    clinicInformation.patientforgotmedicine =
      props.clinicInformation.patientforgotmedicine.toString();

    clinicInformation.dayswithoutmedicine =
      props.clinicInformation.dayswithoutmedicine.toString();

    clinicInformation.adversereactionmedicine =
      props.clinicInformation.adversereactionmedicine.toString();
  }
);

const close = () => {
  show_dialog = false;
};
</script>
