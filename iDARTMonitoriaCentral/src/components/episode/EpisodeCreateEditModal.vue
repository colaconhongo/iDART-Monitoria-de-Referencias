<template>
  <q-page class="q-pa-sm q-gutter-sm">
    <!--
    <q-dialog
      v-model="show_dialog"
      transition-show="flip-up"
      transition-hide="flip-up"
      persistent
    >
      <q-card style="width: 1100px; max-width: 90vw">
        <q-card-section>
          <div class="text-h5 text-center">{{ title }} {{ clinic.value }}</div>
        </q-card-section>

        <q-separator />
        <q-card-section class="scroll" style="max-height: 80vh">
          <q-form class="q-gutter-md" @submit.prevent="createOrUpdate">
            <div class="q-mx-lg">
              <div class="q-mt-lg">
                <div class="row q-mt-md">
                  <TextField
                    label="Código"
                    class="col q-ml-md"
                    ref="code"
                    v-model="clinic.code"
                  />
                  <TextField
                    label="Nome da Farmácia"
                    class="col q-ml-md"
                    ref="clinicname"
                    v-model="clinic.clinicname"
                  />
                  <SelectField
                    label="Tipo de Farmácia"
                    class="col q-ml-md"
                    v-model="clinic.facilitytype"
                    :options="facilitytypes"
                  />
                </div>
                <div class="row q-mt-md">
                  <SelectField
                    label="Distrito"
                    class="col q-ml-md"
                    v-model="clinic.district"
                    :options="
                      alldistrictsFromProvince.map((district) => district.name)
                    "
                    option-label="name"
                  />
                  <TextField
                    label="Contacto"
                    class="col q-ml-md"
                    ref="telephone"
                    v-model="clinic.telephone"
                  />
                  <TextField
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
            @click.stop="createOrUpdate"
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
    -->
  </q-page>
</template>
<script setup>
// import { computed, inject, ref } from 'vue';
// import TextField from '../Shared/Input/TextField.vue';
// import SelectField from '../Shared/Input/SelectField.vue';
// import districtService from 'src/services/districtService/districtService';

// /*
//   Props
// */
// const props = defineProps({
//   close: {
//     type: Function,
//   },
//   createOrUpdate: {
//     type: Function,
//   },
//   clinic: {
//     type: Object,
//   },
// });
// /*
//   Provides
//   */

// const title = inject('title');
// const show_dialog = inject('show_dialog');
// const submitting = inject('submitting');

// /*
// Declaration
// */
// //  editedIndex: -1,
// const facilitytypes = ref(['Privada', 'Comunitária']);

// /*
//   Computed Hooks
// */
// const alldistrictsFromProvince = computed(() => {
//   return districtService.getAllProvinceFromStorage();
// });

// /*
//   Methods
// */
</script>
