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
                <div class="row items-center q-mb-md">
                  <q-icon name="person_outline" size="sm" />
                  <span class="q-pl-sm text-subtitle2"
                    >Dados do Utilizador</span
                  >
                </div>
                <q-separator color="grey-13" size="1px" />
              </div>
              <div class="q-mt-lg">
                <div class="row q-mt-md">
                  <q-input
                    outlined
                    lazy-rules
                    label="Nome"
                    class="col q-ml-md"
                    ref="userFirstnameRef"
                    v-model="user.nome"
                    :disable="createOrEditFlag"
                    :rules="[
                      (val) =>
                        (val && val.length >= 2) ||
                        'Por favor introduza o nome',
                    ]"
                  />
                  <q-input
                    outlined
                    lazy-rules
                    label="Apelido"
                    class="col q-ml-md"
                    ref="userLastnameRef"
                    v-model="user.apelido"
                    :disable="createOrEditFlag"
                    :rules="[
                      (val) =>
                        (val && val.length >= 2) ||
                        'Por favor introduza o apelido',
                    ]"
                  />
                </div>
                <div class="row q-mt-md">
                  <q-input
                    outlined
                    lazy-rules
                    label="Utilizador"
                    class="col q-ml-md"
                    ref="userNameRef"
                    v-model="user.username"
                    :disable="createOrEditFlag"
                    :rules="[
                      (val) =>
                        (val && val.length > 3) ||
                        'Por favor introduza o nome do utilizador',
                    ]"
                  />
                  <q-select
                    outlined
                    class="col q-ml-md"
                    readonly
                    v-model="roleOps"
                    :options="options"
                    label="Perfil"
                  />
                </div>
                <div class="row q-mt-md">
                  <q-input
                    outlined
                    lazy-rules
                    label="Senha"
                    class="col q-ml-md"
                    ref="passRef"
                    v-model="user.pass"
                    :type="isPwd ? 'password' : 'text'"
                    :disable="createOrEditFlag"
                    :rules="[
                      (val) =>
                        (val && val.length > 4) ||
                        'Por favor introduza uma senha com mais de 4 digitos',
                    ]"
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
                    label="Nova Senha"
                    outlined
                    ref="newPassRef"
                    class="col q-ml-md"
                    v-model="newPassword"
                    :type="isNewPwd ? 'password' : 'text'"
                    v-if="createOrEditFlag"
                    @input="
                      (event) => $emit('update:value', event.target.value)
                    "
                    lazy-rules
                    :rules="[
                      (val) =>
                        (val && val.length > 4) ||
                        'Por favor introduza uma senha com mais de 4 digitos',
                    ]"
                  >
                    <template v-slot:append>
                      <q-icon
                        :name="isNewPwd ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        @click="isNewPwd = !isNewPwd"
                      />
                    </template>
                  </q-input>

                  <q-input
                    label="Confirmar Senha "
                    outlined
                    ref="passConfRef"
                    class="col q-ml-md"
                    v-model="confirmPassword"
                    :type="isPwdConf ? 'password' : 'text'"
                    @input="
                      (event) => $emit('update:value', event.target.value)
                    "
                    lazy-rules
                    :rules="[
                      (val) =>
                        (val && val.length > 0) ||
                        'Este campo não pode ser vazio',
                    ]"
                  >
                    <template v-slot:append>
                      <q-icon
                        :name="isPwdConf ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        @click="isPwdConf = !isPwdConf"
                      />
                    </template>
                  </q-input>
                </div>
                <div class="q-mt-lg">
                  <div class="row items-center q-mb-md">
                    <q-icon name="person_outline" size="sm" />
                    <span class="q-pl-sm text-subtitle2"
                      >Endereço e Contacto</span
                    >
                  </div>
                  <q-separator color="grey-13" size="1px" />
                </div>
                <div class="row q-mt-md">
                  <q-input
                    outlined
                    lazy-rules
                    label="Contacto"
                    class="col q-ml-md"
                    ref="userContactoRef"
                    v-model="user.contacto"
                    :disable="createOrEditFlag"
                  />
                  <q-input
                    outlined
                    lazy-rules
                    type="email"
                    label="Email"
                    class="col q-ml-md"
                    ref="userEmailRef"
                    v-model="user.email"
                    :disable="createOrEditFlag"
                    :rules="[(val) => val.length > 0 || '', isValidEmail]"
                  />
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
            @click.stop="validateForm"
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
const userFirstnameRef = ref(null);
const userLastnameRef = ref(null);
const userNameRef = ref(null);
const userEmailRef = ref(null);
const passRef = ref(null);
const passConfRef = ref(null);
const newPassRef = ref(null);
const createOrUpdate = inject('createOrUpdate');
const user = inject('user');
const close = inject('close');
const newPassword = inject('newPass');
const confirmPassword = inject('confirmPassword');
const title = inject('title');
const show_dialog = inject('show_dialog');
const submitting = inject('submitting');
const createOrEditFlag = inject('createOrEditFlag');
const isPwd = ref(true);
const isNewPwd = ref(true);
const isPwdConf = ref(true);
const options = ref([]);
const roleOps = ref('Authenticator');

/*
  Props
*/

/*
  Provides
  */

/*
 Methods
 */
const isValidEmail = (val) => {
  console.log(val);
  const emailPattern =
    /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
  return emailPattern.test(val) || 'Email Inválido';
};
const validateForm = () => {
  if (!createOrEditFlag.value) {
    userFirstnameRef.value.validate();
    userLastnameRef.value.validate();
    userNameRef.value.validate();
    passRef.value.validate();
    passConfRef.value.validate();
    userEmailRef.value.validate();
    if (
      !userFirstnameRef.value.hasError &&
      !userLastnameRef.value.hasError &&
      !userNameRef.value.hasError &&
      !passRef.value.hasError &&
      !passConfRef.value.hasError &&
      !userEmailRef.value.hasError
    ) {
      createOrUpdate();
    }
  } else {
    userFirstnameRef.value.validate();
    userLastnameRef.value.validate();
    userNameRef.value.validate();
    passRef.value.validate();
    newPassRef.value.validate();
    passConfRef.value.validate();
    if (
      !userFirstnameRef.value.hasError &&
      !userLastnameRef.value.hasError &&
      !userNameRef.value.hasError &&
      !passRef.value.hasError &&
      !passConfRef.value.hasError &&
      !newPassRef.value.hasError &&
      !userEmailRef.value.hasError
    ) {
      createOrUpdate();
    }
  }
};
</script>
