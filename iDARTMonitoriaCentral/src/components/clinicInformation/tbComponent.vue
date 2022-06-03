<template>
  <q-markup-table :separator="separator" flat bordered>
    <thead style="background: #e5e5e5">
      <tr>
        <th class="text-left">Perguntas de rastreio de tuberculose</th>
        <th class="text-left">Sim</th>
        <th class="text-left">Não</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="text-left">
          Está actualmente em tratamento profilático com isoniazida (TPI)
        </td>
        <td class="text-left">
          <q-radio
            v-model="clinicInformation.istreatmenttpi"
            val="true"
            :disable="true"
          />
        </td>
        <td class="text-left">
          <q-radio
            v-model="clinicInformation.istreatmenttpi"
            val="false"
            :disable="true"
          />
        </td>
      </tr>

      <tr>
        <td class="text-left">Está em tratamento de tuberculose (TB)</td>
        <td class="text-left">
          <q-radio
            :disable="true"
            v-model="clinicInformation.istreatmenttb"
            val="true"
          />
        </td>
        <td class="text-left">
          <q-radio
            :disable="true"
            v-model="clinicInformation.istreatmenttb"
            val="false"
          />
        </td>
      </tr>
    </tbody>
  </q-markup-table>

  <q-markup-table :separator="separator" flat bordered>
    <thead style="background: #e5e5e5">
      <tr>
        <th class="text-left">Sinais e sintomas sugestivos a TB</th>
        <th class="text-left">Sim</th>
        <th class="text-left">Não</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="text-left">Está com tosse a duas semanas</td>
        <td class="text-left">
          <q-radio
            :disable="true"
            v-model="clinicInformation.iscough"
            val="true"
          />
        </td>
        <td class="text-left">
          <q-radio
            :disable="true"
            v-model="clinicInformation.iscough"
            val="false"
          />
        </td>
      </tr>

      <tr>
        <td class="text-left">Esteve febre nas últimas duas semanas</td>
        <td class="text-left">
          <q-radio
            :disable="true"
            v-model="clinicInformation.isfever"
            val="true"
          />
        </td>
        <td class="text-left">
          <q-radio
            :disable="true"
            v-model="clinicInformation.isfever"
            val="false"
          />
        </td>
      </tr>

      <tr>
        <td class="text-left">Perdeu peso >1.5 Kg no último mês</td>
        <td class="text-left">
          <q-radio
            :disable="true"
            v-model="clinicInformation.islostweight"
            val="true"
          />
        </td>
        <td class="text-left">
          <q-radio
            :disable="true"
            v-model="clinicInformation.islostweight"
            val="false"
          />
        </td>
      </tr>

      <tr>
        <td class="text-left">Tem suado muito a noite</td>
        <td class="text-left">
          <q-radio
            :disable="true"
            v-model="clinicInformation.issweeting"
            val="true"
          />
        </td>
        <td class="text-left">
          <q-radio
            :disable="true"
            v-model="clinicInformation.issweeting"
            val="false"
          />
        </td>
      </tr>

      <tr>
        <td class="text-left">
          Teve cansaço ou fadiga nas últimas duas semanas
        </td>
        <td class="text-left">
          <q-radio
            :disable="true"
            v-model="clinicInformation.hasfatigueortiredneslasttwoweeks"
            val="true"
          />
        </td>
        <td class="text-left">
          <q-radio
            :disable="true"
            v-model="clinicInformation.hasfatigueortiredneslasttwoweeks"
            val="false"
          />
        </td>
      </tr>

      <tr>
        <td class="text-left">
          Tem um parente em casa que está a fazer tratamento de TB
        </td>
        <td class="text-left">
          <q-radio
            :disable="true"
            v-model="clinicInformation.hasparenttbtreatmement"
            val="true"
          />
        </td>
        <td class="text-left">
          <q-radio
            :disable="true"
            v-model="clinicInformation.hasparenttbtreatmement"
            val="false"
          />
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
