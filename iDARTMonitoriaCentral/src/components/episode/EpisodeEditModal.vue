<template>
  <q-page class="q-pa-sm q-gutter-sm">
    <pre>{{ allClinics }}</pre>
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
            <span> {{ patient.firstnames + ' ' + patient.lastname }} </span> |
            <span> {{ patient.sex == 'F' ? 'Feminino' : 'Masculino' }} </span> |
            <span> {{ ageCalculator(patient.dateofbirth) }} anos de idade</span>
          </div>
        </q-card-section>
        <q-separator />

        <q-card-section>
          <div class="text-h5 text-center">Editar Epsódio</div>
        </q-card-section>

        <q-separator />
        <q-card-section class="scroll" style="max-height: 80vh">
          <q-form class="q-gutter-md" @submit.prevent="update">
            <div class="q-mx-lg">
              <div class="q-mt-lg">
                <div class="row q-mt-md">
                  <DateFieldReadOnly
                    label="Data inicio"
                    class="col q-ml-md"
                    v-model="start_date_formated"
                    date="start_date_formated"
                  />
                  <TextFieldReadOnly
                    label="Notas de Inicio [Referência]"
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
import { computed, inject, ref, onMounted } from 'vue';
import DateFieldReadOnly from '../Shared/Input/DateFieldReadOnly.vue';
import SelectField from '../Shared/Input/SelectField.vue';
import TextFieldReadOnly from '../Shared/Input/TextFieldReadOnly.vue';
import { useUtils } from 'src/use/useUtils';
import clinicService from 'src/services/clinicService/clinicService';
import moment from 'moment';
import provinceService from 'src/services/provinceService/provinceService';
import districtService from 'src/services/districtService/districtService';

/*
  Props
*/
const $q = new useQuasar();
const start_date_formated = moment(props.episode.startdate).format(
  'DD-MM-YYYY'
);
const { ageCalculator } = useUtils();
const props = defineProps({
  close: {
    type: Function,
  },
  update: {
    type: Function,
  },
  episode: {
    type: Object,
  },
});
/*
  Provides
  */
const start_notes = ref(['Referido para', 'Referido De']);

const title = inject('title');
const show_dialog = inject('show_dialog');
const submitting = inject('submitting');
const patient = inject('patient');

/*
  Mounted Hooks
*/
onMounted(() => {
  $q.loading.show({
    message: 'Carregando ...',
    spinnerColor: 'grey-4',
    spinner: QSpinnerBall,
  });
  setTimeout(() => {
    $q.loading.hide();
  }, 600);
  getAllClinicFromAPI(0);
});

/*
  Computed
*/
const allClinics = computed(() => {
  return clinicService.getAllDDPharm();
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
