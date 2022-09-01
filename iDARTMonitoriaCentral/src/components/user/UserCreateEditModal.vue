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
          <div class="text-h5 text-center">
            {{ title }}
          </div>
        </q-card-section>

        <q-separator />
        <q-card-section class="scroll" style="max-height: 80vh">
          <q-form class="q-gutter-md" @submit.prevent="createOrUpdate">
            <div class="q-mx-lg">
              <div class="q-mt-lg">
                <div class="row q-mt-md">
                  <TextField
                    label="Nome do Utilizador"
                    class="col q-ml-md"
                    ref="username"
                    v-model="user.username"
                    :disable="createOrEditFlag"
                  />
                </div>
                <div class="row q-mt-md">
                  <TextField
                    label="Senha"
                    class="col q-ml-md"
                    ref="pass"
                    v-model="user.pass"
                    type="password"
                    :disable="createOrEditFlag"
                    v-if="createOrEditFlag"
                  />

                  <q-input
                    label="Nova Senha"
                    outlined
                    ref="ref"
                    class="col q-ml-md"
                    v-model="newPassword"
                    :type="isPwd ? 'password' : 'text'"
                    @input="
                      (event) => $emit('update:value', event.target.value)
                    "
                    lazy-rules
                  >
                    <template v-slot:append>
                      <q-icon
                        :name="isPwd ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        @click="isPwd = !isPwd"
                      />
                    </template>
                  </q-input>

                  <q-input
                    label="Confirmar Senha "
                    outlined
                    ref="ref"
                    class="col q-ml-md"
                    v-model="confirmPassword"
                    :type="isPwd ? 'password' : 'text'"
                    @input="
                      (event) => $emit('update:value', event.target.value)
                    "
                    lazy-rules
                  >
                    <template v-slot:append>
                      <q-icon
                        :name="isPwd ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        @click="isPwd = !isPwd"
                      />
                    </template>
                  </q-input>
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
            @click.stop="createOrUpdate"
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
import { inject, ref } from 'vue';
import TextField from '../Shared/Input/TextField.vue';

const createOrUpdate = inject('createOrUpdate');
const user = inject('user');

const isPwd = ref(true);

/*
  Props
*/

/*
  Provides
  */

const close = inject('close');
const newPassword = inject('newPass');
const confirmPassword = inject('confirmPassword');
const title = inject('title');
const show_dialog = inject('show_dialog');
const submitting = inject('submitting');
const createOrEditFlag = inject('createOrEditFlag');
</script>
