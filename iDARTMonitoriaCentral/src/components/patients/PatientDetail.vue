<template>
  <div class="patient-detail">
    <q-card class="my-card" style="text-align: center">
      <q-card-section>
        <q-icon
          class="profile"
          :name="patient.sex == 'F' ? 'female' : 'male'"
          size="120px"
          color="primary"
        />
        <div>
          <div class="patient-details">
            <p style="margin-bottom: 0%" class="text-weight-bolder">
              {{ patient.firstnames + ' ' + patient.lastname }}
            </p>
          </div>
          <div class="patient-details">
            <span class="text-weight-bolder"> NID: </span
            ><span>{{ patient.patientid }}</span>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-4">
            <div class="patient-details">
              <span>
                <q-icon name="perm_identity" color="blue-8" size="sm"
              /></span>
            </div>
            <div class="patient-details">
              <span>{{ patient.sex == 'F' ? 'Feminino' : 'Masculino' }}</span>
            </div>
          </div>
          <div class="col-sm-4">
            <div class="patient-details">
              <span>
                <q-icon name="calendar_today" color="blue-8" size="sm"
              /></span>
            </div>
            <div class="patient-details">
              <span> {{ ageCalculator(patient.dateofbirth) }} anos </span>
            </div>
          </div>
          <div class="col-sm-4">
            <div class="patient-details">
              <span> <q-icon name="phone" color="blue-8" size="sm" /></span>
            </div>
            <div>
              <span>{{ patient.cellphone }}</span>
            </div>
          </div>
        </div>
        <div>
          <span>
            <q-icon name="place" color="blue-8" size="sm" />
            <small> {{ patient.address1 }}</small></span
          >
        </div>
      </q-card-section>
      <q-separator></q-separator>
      <q-card-section style="text-align: center">
        <b> Dados de Referência</b>
        <div class="dados-referencia-tit" style="text-align: left">
          Data da Referência
        </div>
        <div class="dados-referencia" style="text-align: left">
          <span>{{
            patient.prescriptiondate === null ||
            patient.prescriptiondate === undefined
              ? 'Não definido '
              : moment(patient.prescriptiondate).format('DD-MM-YYYY')
          }}</span>
        </div>
        <div style="text-align: left">Framácia de Referência</div>
        <div class="dados-referencia" style="text-align: left">
          <span>{{ patient.clinicname }}</span>
        </div>
        <div style="text-align: left">Unidade Sanitária</div>
        <div class="dados-referencia" style="text-align: left">
          <span>{{ patient.mainclinicname }}</span>
        </div>
        <div style="text-align: left">Data Início TARV</div>
        <div class="dados-referencia" style="text-align: left">
          <span>{{ moment(patient.datainiciotarv).format('DD-MM-YYYY') }}</span>
        </div>
        <div class="dados-referencia-tit" style="text-align: left">Estado</div>
        <div
          style="
            background-color: rgb(216 255 242);
            color: #26bb0a;
            text-align: center;
            width: 100%;
            margin-top: 5px;
            margin-bottom: 5px;
            padding: 8px;
          "
          v-if="patient.syncstatus == 'S'"
        >
          <span>
            <q-icon name="done_all" color="green" />
            <small style="font-size: small"> Enviado</small></span
          >
        </div>
        <div
          style="
            background-color: rgb(255 240 231);
            color: #ff9d0d;
            text-align: center;
            width: 100%;
            margin-top: 5px;
            margin-bottom: 5px;
            padding: 8px;
          "
          v-if="patient.syncstatus == 'U'"
        >
          <span>
            <q-icon name="update" color="#ff9d0d" />
            <small style="font-size: small"> Actualizado</small></span
          >
        </div>
        <div
          style="
            background-color: #f5cbc8;
            color: #fb1808;
            text-align: center;
            width: 100%;
            margin-top: 5px;
            margin-bottom: 5px;
            padding: 8px;
          "
          v-if="patient.syncstatus == 'P'"
        >
          <span>
            <q-icon name="pending_actions" color="#fb1808" />
            <small style="font-size: small"> Pendente</small></span
          >
        </div>
        <q-separator color="blue-8"></q-separator>
        <div class="row q-my-md q-ml-xl">
          <q-btn
            color="primary"
            icon="print"
            label="Imprimir fila"
            @click="printFilaReport"
          />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { inject } from 'vue';
import useUtils from 'src/use/useUtils';
import reportFila from 'src/services/ReportServices/fila/filaReport';
import prescriptionService from 'src/services/prescriptionService/prescriptionService';

import moment from 'moment';

const { ageCalculator } = useUtils();
const patient = inject('patient');

const printFilaReport = () => {
  reportFila.downloadPDF(patient.value);
};
</script>

<style scoped>
.patient-detail {
  margin-top: 150px;
  padding: 10px;
  margin-left: auto;
  margin-right: auto;
  font-size: 14px;
}
.dados-referencia {
  background-color: rgb(228 245 255);
  color: rgb(0 108 171);
  text-align: center;
  width: 100%;
  margin-top: 5px;
  margin-bottom: 5px;
  padding: 8px;
}
.patient-details {
  margin: 8px;
}
</style>
