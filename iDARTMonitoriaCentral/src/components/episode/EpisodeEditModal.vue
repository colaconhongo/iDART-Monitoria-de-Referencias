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
            <span class="q-ml-md"
              ><q-img src="/icons/patient.jpeg" height="50px" width="50px"
            /></span>
            <span> {{ patient.firstnames + ' ' + patient.lastname }} </span> |
            <span> {{ patient.sex == 'F' ? 'Feminino' : 'Masculino' }} </span> |
            <span>
              {{ useUtils.ageCalculator(patient.dateofbirth) }} anos de
              idade</span
            >
          </div>
        </q-card-section>
        <q-separator />

        <q-card-section>
          <div class="text-h5 text-center">Editar Episódio</div>
        </q-card-section>
        <q-separator />
        <q-card-section class="scroll" style="max-height: 80vh">
          <q-form class="q-gutter-md" @submit.prevent="update">
            <div class="q-mx-lg">
              <div class="q-mt-lg">
                <div class="row q-mt-md">
                  <DateFieldReadOnly
                    label="Data Início"
                    class="col q-ml-md"
                    v-model="startdateformated"
                  />
                  <TextFieldReadOnly
                    label="Notas de Início [Referência]"
                    class="col q-ml-md"
                    ref="code"
                    v-model="episode.startnotes"
                  />
                  <SelectField
                    label="Farmácia de [Referência]"
                    class="col q-ml-md"
                    v-model="episode.clinic"
                    :options="allClinics.map((clinic) => clinic)"
                    option-id="id"
                    option-label="clinicname"
                  />
                </div>
              </div>
            </div>
          </q-form>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn
            :loading="submitting"
            color="teal"
            label="Gravar"
            type="submit"
            @click.stop="update"
          />
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
import { useQuasar, QSpinnerBall } from 'quasar';
import { computed, inject, onMounted } from 'vue';
import DateFieldReadOnly from '../Shared/Input/DateFieldReadOnly.vue';
import SelectField from '../Shared/Input/SelectField.vue';
import TextFieldReadOnly from '../Shared/Input/TextFieldReadOnly.vue';
import useUtils from 'src/use/useUtils';
import clinicService from 'src/services/clinicService/clinicService';
import provinceService from 'src/services/provinceService/provinceService';
import districtService from 'src/services/districtService/districtService';

/*
  Props
*/
const show_dialog = inject('show_dialog');
const submitting = inject('submitting');
const patient = inject('patient');
const episode = inject('episode');
const update = inject('update');
const close = inject('close');
// alert(start_date_formated)

/*
  Mounted Hooks
*/
onMounted(() => {
  getAllClinicFromAPI(0);
});

/*
  Computed
*/
const allClinics = computed(() => {
  return clinicService.getAllDDPharm();
});

const startdateformated = computed({
  get() {
    if (episode.value.startdate === null) return null;
    return useUtils.getDateFormatDDMMYYYY(episode.value.startdate);
  },
});

/*
  Methods
*/
const getAllClinicFromAPI = (offset) => {
  if (offset >= 0) {
    clinicService.get(offset);
    provinceService.get(offset);
    districtService.get(offset);
  }
};
</script>
