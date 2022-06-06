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
          <div class="text-h5 text-center">{{ title }} {{ episode.value }}</div>
        </q-card-section>

        <q-separator />
        <q-card-section class="scroll" style="max-height: 80vh">
          <q-form class="q-gutter-md" @submit.prevent="update">
            <div class="q-mx-lg">
              <div class="q-mt-lg">
                <div class="row q-mt-md">
                  <TextField
                    label="Data de inicio"
                    class="col q-ml-md"
                    ref="startdate"
                    v-model="episode.startdate"
                  />
                  <SelectField
                    label="Notas de Inicio"
                    class="col q-ml-md"
                    v-model="episode.startnotes"
                    :options="start_notes"
                  />
                  <SelectField
                    label="Notas de Inicio"
                    class="col q-ml-md"
                    v-model="episode.startnotes"
                    :options="start_notes"
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
import { computed, inject, ref } from 'vue';
import DateField from '../Shared/Input/DateField.vue';
import TextField from '../Shared/Input/TextField.vue';
import SelectField from '../Shared/Input/SelectField.vue';
import districtService from 'src/services/districtService/districtService';

/*
  Props
*/
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
const end_notes = ref(['Referido para mesma US', 'Faltoso', '']);

const title = inject('title');
const show_dialog = inject('show_dialog');
const submitting = inject('submitting');

/*
  Methods
*/
</script>
