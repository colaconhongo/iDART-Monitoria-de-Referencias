<template>
  <div class="q-pa-sm q-gutter-sm">
    <q-dialog v-model="show_dialog" persistent>
      <q-card style="width: 600px; max-width: 60vw">
        <q-card-section>
          <div class="text-h6">{{ createEdit }} Província!</div>
        </q-card-section>
        <q-card-section>
          <div
            v-if="listErrors.length > 0"
            class="q-pa-sm q-gutter-sm"
            style="
              max-width: 550px;
              max-height: 150px;
              border-radius: 10px;
              border: 1px solid #cb4646;
              margin: 5px;
              background-color: #ead8da;
            "
          >
            <ul class="list-group alert alert-danger">
              <li
                class="list-group-item text-negative q-pl-xs text-weight-regular text-caption"
                v-for="item in listErrors"
                :key="item"
              >
                {{ item }}
              </li>
            </ul>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section style="max-height: 50vh" class="scroll">
          <q-form @submit.prevent="createProvincia" class="q-gutter-md">
            <q-list>
              <div class="row">
                <div class="row q-gutter-xs" style="width: 500px">
                  <div class="col-4 text-left">Codigo *</div>
                  <q-input
                    outlined
                    tack-label
                    class="w-field"
                    :dense="true"
                    v-model="province.code"
                    ref="code"
                    lazy-rules
                    :rules="[
                      (val) =>
                        (val && val.length > 0) ||
                        'Introduza o codigo da Província',
                    ]"
                  />
                </div>
                <div class="row q-gutter-xs" style="width: 500px">
                  <div class="col-4 text-left">Designação *</div>
                  <q-input
                    outlined
                    tack-label
                    class="w-field"
                    :dense="true"
                    v-model="province.description"
                    ref="description"
                    lazy-rules
                    :rules="[
                      (val) =>
                        (val && val.length > 0) || 'Introduza a Designação',
                    ]"
                  />
                </div>
              </div>
              <div class="row">
                <div class="row q-gutter-xs" style="width: 500px">
                  <div class="col-4 text-left">País *</div>
                  <q-select
                    filled
                    outlined
                    tack-label
                    class="w-field"
                    :dense="true"
                    v-model="pais"
                    use-input
                    fill-input
                    hide-selected
                    input-debounce="0"
                    :options="options"
                    option-label="designacao"
                    option-value="codigo"
                    @filter="filterFn"
                    @input="$emit('update:pais', $event)"
                    abort="abortFilterFn"
                    hint="Autocompleta o Texto"
                  >
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No results
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>
              </div>
            </q-list>
          </q-form>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn
            type="submit"
            :loading="submitting"
            @click.stop="createProvincia"
            color="teal"
            label="Gravar"
          />
          <q-btn
            label="Cancelar"
            type="reset"
            @click="close"
            color="negative"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script setup>
import { ref } from 'vue';

const options = ref([]);
// const emit = defineEmits(['update'])

const props = defineProps({
  show_dialog: {
    type: Boolean,
  },
  listErrors: {
    type: Array,
  },
  createEdit: {
    type: String,
  },
  codigo: {
    type: String,
  },
  designacao: {
    type: String,
  },
  pais: {
    type: Object,
  },
  province: {
    type: Object,
  },
  paises: {
    type: Array,
  },
  submitting: {
    type: Boolean,
  },
  close: {
    type: Function,
  },
  createProvincia: {
    type: Function,
  },
  removeProvincia: {
    type: Function,
  },
});

const filterFn = (val, update, abort) => {
  const stringOptions = props.paises;
  if (val === '') {
    update(() => {
      options.value = stringOptions.map((pais) => pais);
    });
  } else if (stringOptions.length === 0) {
    update(() => {
      options = [];
    });
  } else {
    update(() => {
      options.value = stringOptions
        .map((pais) => pais)
        .filter((pais) => {
          return (
            pais &&
            pais.designacao.toLowerCase().indexOf(val.toLowerCase()) !== -1
          );
        });
    });
  }
};
</script>
<style scoped>
.w-field {
  width: 300px;
}
</style>
