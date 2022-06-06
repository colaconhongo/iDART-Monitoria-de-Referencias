<template>
  <div class="patient-detail">
    <q-card class="my-card" style="text-align: center">
      <q-card-section>
        <q-avatar
          rounded
          size="100px"
          font-size="82px"
          color="primary"
          text-color="white"
          icon="person"
        ></q-avatar>
        <div>
          <p style="margin-bottom: 0%">
            {{ patient.firstnames + ' ' + patient.lastname }}
          </p>
          <small
            >NID: <span>{{ patient.patientid }}</span></small
          >
        </div>
        <div class="row">
          <div class="col-sm-4">
            <div>
              <span> <q-icon name="perm_identity" color="blue-8" /></span>
            </div>
            <div>
              <span
                ><small>{{ patient.sex }}</small></span
              >
            </div>
          </div>
          <div class="col-sm-4">
            <div>
              <span> <q-icon name="calendar_today" color="blue-8" /></span>
            </div>
            <div>
              <span><small>64 anos</small></span>
            </div>
          </div>
          <div class="col-sm-4">
            <div>
              <span> <q-icon name="phone" color="blue-8" /></span>
            </div>
            <div>
              <span
                ><small>{{ patient.cellphone }}</small></span
              >
            </div>
          </div>
        </div>
        <div>
          <span>
            <q-icon name="place" color="blue-8" />
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
          <span>{{ patient.datainiciotarv }}</span>
        </div>
        <div style="text-align: left">Framácia de Referência</div>
        <div class="dados-referencia" style="text-align: left">
          <span>{{ patient.clinicname }}</span>
        </div>
        <div style="text-align: left">Unidade Sanitária</div>
        <div class="dados-referencia" style="text-align: left">
          <span>{{ patient.mainclinic }}</span>
        </div>
        <div style="text-align: left">Data Início TARV</div>
        <div class="dados-referencia" style="text-align: left">
          <span>Data Início TARV</span>
        </div>
        <q-separator color="blue-8"></q-separator>
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
        >
          <span>
            <q-icon name="done_all" color="green" />
            <small style="font-size: small"> Enviado</small></span
          >
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { computed, inject, onMounted, reactive, ref } from 'vue';
const patient = inject('patient');
</script>

<style scoped>
.patient-detail {
  margin-top: 190px;
  padding: 10px;
  margin-left: auto;
  margin-right: auto;
  font-size: 13px;
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
</style>
