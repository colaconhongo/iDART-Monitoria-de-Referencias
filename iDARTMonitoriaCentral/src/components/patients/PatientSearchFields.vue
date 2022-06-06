<template>
  <div class="row">
    <TextField
      label="No do Identificador"
      class="col q-ml-md"
      ref="id"
      v-model="patient.id"
    />
    <TextField label="Nome" class="col q-ml-md" ref="id" v-model="patient.id" />
    <TextField
      label="Sobre Nome"
      class="col q-ml-md"
      ref="id"
      v-model="patient.id"
    />
    <TextField
      label="Apelido"
      class="col q-ml-md"
      ref="id"
      v-model="patient.id"
    />
  </div>
</template>
<script setup>
import { computed, inject, ref } from 'vue';
import TextField from '../Shared/Input/TextField.vue';

const patient = inject('patient');
</script>
