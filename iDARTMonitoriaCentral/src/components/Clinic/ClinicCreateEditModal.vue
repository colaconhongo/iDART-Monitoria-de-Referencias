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
          <div class="text-h5 text-center">{{ title }}</div>
        </q-card-section>

        <q-separator />
        <q-card-section class="scroll" style="max-height: 80vh">
          <q-form class="q-gutter-md" @submit.prevent="createOrUpdate">
            <div class="q-mx-lg">
              <div class="q-mt-lg">
                <div class="row q-mt-md">
                  <q-input
                    outlined
                    label="Código"
                    class="col q-ml-md"
                    ref="code"
                    v-model="clinic.code"
                    :rules="[
                      (val) =>
                        (val && val.length > 3) ||
                        'Por favor introduza o código da farmácia',
                    ]"
                  />
                  <q-input
                    outlined
                    label="Nome da Farmácia"
                    class="col q-ml-md"
                    ref="clinicname"
                    v-model="clinic.clinicname"
                    :rules="[
                      (val) =>
                        (val && val.length > 3) ||
                        'Por favor introduza o nome da farmácia',
                    ]"
                  />
                  <q-select
                    outlined
                    label="Tipo de Farmácia"
                    class="col q-ml-md"
                    ref="facilitytype"
                    v-model="clinic.facilitytype"
                    :options="facilitytypes"
                  />
                </div>
                <div class="row q-mt-md">
                  <q-select
                    outlined
                    label="Distrito"
                    class="col q-ml-md"
                    v-model="clinic.district"
                    ref="district"
                    :options="
                      alldistrictsFromProvince.map((district) => district.name)
                    "
                    option-label="name"
                  />
                  <q-input
                    outlined
                    label="Contacto"
                    class="col q-ml-md"
                    ref="telephone"
                    v-model="clinic.telephone"
                    lazy-rules
                    :rules="[
                      (val) =>
                        (val && val.length >= 9) ||
                        'Por favor introduza o contacto',
                    ]"
                  />
                  <q-input
                    outlined
                    label="Notas"
                    class="col q-ml-md"
                    ref="notes"
                    v-model="clinic.notes"
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
            @click.stop="validateForm"
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
import { computed, inject, ref } from 'vue';
import districtService from 'src/services/districtService/districtService';

const code = ref(null);
const clinicname = ref(null);
const facilitytype = ref(null);
const district = ref(null);
const telephone = ref(null);
const notes = ref(null);

const createOrUpdate = inject('createOrUpdate');
const clinic = inject('clinic');

/*
  Props
*/
const props = defineProps({
  close: {
    type: Function,
  },
  createOrUpdate: {
    type: Function,
  },
});
/*
  Provides
  */

const title = inject('title');
const show_dialog = inject('show_dialog');
const submitting = inject('submitting');

/*
Declaration
*/
//  editedIndex: -1,
const facilitytypes = ref(['Privada', 'Comunitária']);

/*
  Computed Hooks
*/
const alldistrictsFromProvince = computed(() => {
  return districtService.getAllProvinceFromStorage();
});

/*
  Methods
*/

const validateForm = () => {
  code.value.validate();
  clinicname.value.validate();
  facilitytype.value.validate();
  district.value.validate();

  if (
    !code.value.hasError &&
    !clinicname.value.hasError &&
    !facilitytype.value.hasError &&
    !district.value.hasError
  ) {
    createOrUpdate();
  }
};
</script>
