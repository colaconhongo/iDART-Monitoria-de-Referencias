<template>
  <div class="q-pa-md">
    <q-markup-table :separator="separator" flat bordered>
      <tbody>
        <strong>Dados Vitais</strong>
        <tr>
          <td class="text-left">Altura</td>
          <td class="text-left">{{ clinicInformation.height }} [Cm]</td>
        </tr>
        <tr>
          <td class="text-left">Peso</td>
          <td class="text-left">{{ clinicInformation.weight }} [Kg]</td>
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
          <td class="text-left">{{ clinicInformation.systole }} [mmHg]</td>
        </tr>
        <tr>
          <td class="text-left">Diastole</td>
          <td class="text-left">{{ clinicInformation.distort }} [mmHg]</td>
        </tr>
      </tbody>
    </q-markup-table>
  </div>
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
