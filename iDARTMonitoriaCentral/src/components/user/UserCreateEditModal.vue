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
                    :rules="[
                      (val) =>
                        (val && val.length >= 2) ||
                        'Por favor introduza o nome do utilizador com pelo menos 3 caracteres',
                    ]"
                  />
                  <q-input
                    outlined
                    lazy-rules
                    label="Apelido"
                    class="col q-ml-md"
                    ref="userLastnameRef"
                    v-model="user.apelido"
                    :rules="[
                      (val) =>
                        (val && val.length >= 2) ||
                        'Por favor introduza o apelido do utilizador com pelo menos 3 caracteres',
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
                    :rules="[
                      (val) =>
                        (val && val.length > 2) ||
                        'Por favor introduza o nome do utilizador com pelo menos 3 caracteres',
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
                    label="Senha actual"
                    class="col q-ml-md"
                    ref="currentPassRef"
                    v-model="currentPassword"
                    :type="isPwd ? 'password' : 'text'"
                    v-if="createOrEditFlag"
                    :rules="[
                      (val) =>
                        (val && val.length > 4) ||
                        'Por favor introduza uma senha com mais de 4 caracteres',
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
                    v-if="newUserFlag"
                    @input="
                      (event) => $emit('update:value', event.target.value)
                    "
                    lazy-rules
                    :rules="[
                      (val) =>
                        (val && val.length > 4) ||
                        'Por favor introduza uma senha com mais de 4 caracteres',
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
                    label="Contacto"
                    v-model="user.contacto"
                    class="col q-ml-md"
                    ref="userContactoRef"
                    lazy-rules
                  />
                  <q-input
                    outlined
                    lazy-rules
                    type="email"
                    label="Email"
                    class="col q-ml-md"
                    ref="userEmailRef"
                    v-model="user.email"
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
const currentPassRef = ref(null);
const passConfRef = ref(null);
const newPassRef = ref(null);
const createOrUpdate = inject('createOrUpdate');
const user = inject('user');
const close = inject('close');
const newPassword = inject('newPass');
const currentPassword = inject('currentPassword');
const confirmPassword = inject('confirmPassword');
const title = inject('title');
const show_dialog = inject('show_dialog');
const submitting = inject('submitting');
const createOrEditFlag = inject('createOrEditFlag');
const newUserFlag = inject('newUserFlag');
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
  const emailPattern =
    /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
  return emailPattern.test(val) || 'Email Inválido';
};
const validateForm = () => {
  if (
    user.value.email != null &&
    user.value.email != undefined &&
    user.value.email != ''
  ) {
    userEmailRef.value.validate();
  } else {
    userEmailRef.value.resetValidation();
  }

  if (!createOrEditFlag.value) {
    userFirstnameRef.value.validate();
    userLastnameRef.value.validate();
    userNameRef.value.validate();
    passConfRef.value.validate();

    if (
      !userFirstnameRef.value.hasError &&
      !userLastnameRef.value.hasError &&
      !userNameRef.value.hasError &&
      !passConfRef.value.hasError &&
      !userEmailRef.value.hasError
    ) {
      createOrUpdate();
    }
  } else {
    userFirstnameRef.value.validate();
    userLastnameRef.value.validate();
    userNameRef.value.validate();
    currentPassRef.value.validate();
    if (
      newPassword.value != null &&
      newPassword.value != undefined &&
      newPassword.value != ''
    ) {
      newPassRef.value.validate();
      passConfRef.value.validate();
    } else {
      newPassRef.value.resetValidation();
      passConfRef.value.resetValidation();
    }

    if (
      !userFirstnameRef.value.hasError &&
      !userLastnameRef.value.hasError &&
      !userNameRef.value.hasError &&
      !currentPassRef.value.hasError &&
      !passConfRef.value.hasError &&
      !newPassRef.value.hasError &&
      !userEmailRef.value.hasError
    ) {
      createOrUpdate();
    }
  }
};
</script>
