<template>
  <q-markup-table :separator="separator" flat bordered>
    <thead style="background: #e5e5e5">
      <tr>
        <th class="text-left">
          Perguntas de reacções adversas aos medicamentos
        </th>
        <th class="text-left">Sim</th>
        <th class="text-left">Não</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="text-left">
          Tem alguma reacção adversa que acha que é causdada pelos medicamentos
        </td>
        <td class="text-left">
          <q-radio
            :disable="true"
            v-model="clinicInformation.adversereactionmedicine"
            val="true"
          />
        </td>
        <td class="text-left">
          <q-radio
            :disable="true"
            v-model="clinicInformation.adversereactionmedicine"
            val="false"
          />
        </td>
      </tr>

      <tr v-if="!clinicInformation.adversereactionmedicine">
        <td class="text-left">Descreva brevemente a reacção</td>
        <td class="text-left" colspan="2">
          <q-field filled stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">
                {{ clinicInformation.adversereaction }}
              </div>
            </template>
          </q-field>
        </td>
      </tr>
    </tbody>
  </q-markup-table>
</template>

<script setup>
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
</script>
