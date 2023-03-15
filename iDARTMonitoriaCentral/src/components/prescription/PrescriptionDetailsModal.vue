<template>
  <q-page class="q-pa-sm q-gutter-sm">
    <q-dialog
      v-model="show_dialog"
      transition-show="flip-up"
      transition-hide="flip-up"
      persistent
    >
      <q-card style="width: 1500px; max-width: 90vw">
        <q-separator />
        <q-card-section>
          <div class="text-h5 text-center">
            ID da Prescrição: {{ prescription.prescriptionid }}
          </div>
        </q-card-section>

        <q-separator />
        <q-card-section class="scroll" style="max-height: 80vh">
          <q-form class="q-gutter-md">
            <div class="q-mx-lg">
              <div class="q-mt-lg">
                <div class="row q-mt-md">
                  <div class="q-mx-lg" style="width: 1500px">
                    <div class="q-pa-md">
                      <listClinic
                        :columns="columns"
                        :mode="mode"
                        :with_downloadButton="true"
                        :rows="allDispenses"
                        :title="props.title"
                        :with_actionRemoveButton="false"
                        :with_actionEditButton="false"
                        :with_actionDetailButton="false"
                      />
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
            label="Voltar"
            type="reset"
            @click="show_dialog == false"
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

import { computed, reactive, ref, inject } from 'vue';
import listClinic from 'src/components/Shared/CRUD/TableList.vue';
import prescriptionService from 'src/services/prescriptionService/prescriptionService';
import moment from 'moment';

const patient = inject('patient');
const prescription = inject('prescription');
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
  title: {
    type: String,
    default: 'Dispensas',
  },
  patient: {
    type: Object,
  },
});

/*
Declarations
*/
const mode = reactive(ref('list'));
let show_dialog = inject('show_dialog');

const columns = [
  {
    name: 'pickupdate',
    required: true,
    label: 'Data de levantamento',
    align: 'left',
    field: (row) => moment(row.pickupdate).format('DD-MM-YYYY'),
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'drugname',
    align: 'left',
    label: 'Medicamento',
    field: (row) => row.drugname,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'qtyinhand',
    align: 'left',
    label: 'Quantidade (Frasco)',
    field: (row) => row.qtyinhand.replace(/[{()}]/g, ''),
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'duration',
    align: 'left',
    label: 'Duração (meses)',
    field: (row) => (row.duration !== null ? row.duration / 4 : 0),
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'dateexpectedstring',
    align: 'left',
    label: 'Data próximo levantamento',
    field: (row) => moment(row.dateexpectedstring).format('DD-MM-YYYY'),
    format: (val) => `${val}`,
    sortable: true,
  },
];

/*
  Methods
*/

const allDispenses = computed(() => {
  return prescriptionService.getPrescriptionsByPrescriptionId(
    prescription.value.prescriptionid, patient.value.patientid
  );
});

const close = () => {
  show_dialog = false;
};
</script>
