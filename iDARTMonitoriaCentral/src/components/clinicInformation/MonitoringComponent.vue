<template>
  <q-markup-table :separator="separator" flat bordered>
    <thead style="background: #e5e5e5">
      <tr>
        <th class="text-left">Perguntas de Monitoria e reforço a adesão</th>
        <th class="text-left">Sim</th>
        <th class="text-left">Não</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="text-left">O paciente veio na data marcada</td>
        <td class="text-left">
          <q-radio
            :disable="true"
            v-model="clinicInformation.haspatientcamecorrectdate"
            val="true"
          />
        </td>
        <td class="text-left">
          <q-radio
            :disable="true"
            v-model="clinicInformation.haspatientcamecorrectdate"
            val="false"
          />
        </td>
      </tr>

      <tr v-if="!clinicInformation.haspatientcamecorrectdate">
        <td class="text-left">
          Se não, quantos dias de atraso completou o paciente?
        </td>
        <td class="text-left" colspan="2">
          <q-field filled stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">
                {{ clinicInformation.latedays }}
              </div>
            </template>
          </q-field>
        </td>
      </tr>

      <tr>
        <td class="text-left">
          Nos últimos 2 meses teria se esquecido de tomar os seus medicamentos
          algum dia na sua hora habitual
        </td>
        <td class="text-left">
          <q-radio
            :disable="true"
            v-model="clinicInformation.patientforgotmedicine"
            val="true"
          />
        </td>
        <td class="text-left">
          <q-radio
            :disable="true"
            v-model="clinicInformation.patientforgotmedicine"
            val="false"
          />
        </td>
      </tr>

      <tr v-if="!clinicInformation.patientforgotmedicine">
        <td class="text-left">
          Quantos dias passou da hora sem tomar os comprimidos?
        </td>
        <td class="text-left">
          <q-field filled stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">
                {{ clinicInformation.dayswithoutmedicine }}
              </div>
            </template>
          </q-field>
        </td>
      </tr>

      <tr v-if="!clinicInformation.patientforgotmedicine">
        <td class="text-left">Motivos</td>
        <td class="text-left" colspan="2">
          <q-field filled stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">
                {{ clinicInformation.latemotives }}
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
