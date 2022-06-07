<template>
  <div class="q-pa-md">
    <q-markup-table :separator="separator" flat bordered>
      <thead style="background: #e5e5e5">
      <tr>
        <th class="text-left" colspan="2"><strong>Dados Vitais</strong></th>

      </tr>
    </thead>

      <tbody>
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
      </tbody>

    </q-markup-table>

    <q-markup-table :separator="separator" flat bordered>

    <thead style="background: #e5e5e5">
      <tr>
        <th class="text-left" colspan="2"><strong>Tensão Arterial</strong></th>

      </tr>
    </thead>

      <tbody>
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
