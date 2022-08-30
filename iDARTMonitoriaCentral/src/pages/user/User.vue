<template>
  <q-page class="q-pa-sm q-gutter-sm">
    <UserHome :is="activeUserHome" v-model:title="titleList" />
    <UserDetailsVue :is="activeDetails" v-model:title="titleDetails" />
    <CreateEditUser
      :is="true"
      v-model:createOrUpdate="createOrUpdate"
      v-model:close="close"
    />

    <div class="absolute-bottom">
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn size="xl" fab icon="add" @click="createUser()" color="primary" />
      </q-page-sticky>
    </div>
  </q-page>
</template>
<script setup>
import UserHome from 'src/components/user/UserHome.vue';
import UserDetailsVue from 'src/components/user/UserDetails.vue';
import CreateEditUser from 'src/components/user/UserCreateEditModal.vue';
import { provide, inject, reactive, ref } from 'vue';
import SecUsersService from 'src/services/secUsersService/SecUsersService';
import { confirm } from 'src/components/Shared/Directives/Plugins/Dialog/dialog';
import { useI18n } from 'vue-i18n';
import { alert } from '../../components/Shared/Directives/Plugins/Dialog/dialog';

/*
Declarations
*/
const titleList = reactive(ref('Lista de Utilizadores'));
const titleAddEdit = reactive(ref('Dados do Utilizador'));
const titleDetails = reactive(ref('Detalhes do Utilizador'));
const show_dialog = reactive(ref(false));
const submitting = reactive(ref(false));
const user = reactive(ref([]));
const editedIndex = reactive(ref(0));
const activeUserHome = reactive(ref(true));
const activeEditDialog = reactive(ref(false));
const activeDetails = reactive(ref(false));
const { t } = useI18n();

const details_dialog = reactive(ref(false));
let createOrEditFlag = reactive(ref(false));
let confirmPassword = reactive(ref(''));

provide('title', titleAddEdit);
provide('show_dialog', show_dialog);
// provide('clinic', clinic);
provide('submitting', submitting);
const newPass = reactive(ref(''));

/**
 * Declarations
 */

let params = {
  username_user: '',
  pass_user: '',
  role_user: '',
  operation_type_user: '',
};

/*
  Methods
*/

const createUser = () => {
  createOrEditFlag.value = false;
  titleAddEdit.value = t('add').concat(' ').concat('Utilizador');
  user.value = reactive(SecUsersService.newInstanceEntity());
  activeEditDialog.value = true;
  show_dialog.value = true;
  editedIndex.value = 1;
};

const createOrUpdate = () => {
  if (confirmPassword.value == newPass.value) {
    params.pass_user = newPass.value;
    params.role_user = 'authenticator';
    params.username_user = user.value.username;
    submitting.value = true;
    console.log('Parametros:', params);
    if (editedIndex.value != 1) {
      params.operation_type_user = 'U';
      SecUsersService.post(params)
        .then(() => {
          submitting.value = false;
          close();
        })
        .catch(() => {
          submitting.value = false;
        });
    } else {
      delete user.value['username'];
      params.operation_type_user = 'C';
      SecUsersService.post(params)
        .then(() => {
          submitting.value = false;
          close();
        })
        .catch(() => {
          submitting.value = false;
        });
    }
  } else {
    alert(
      'Erro!',
      'O campo nova senha e confirmar a senha devem ser iguais',
      null,
      null,
      null
    );
  }
};

const editUser = (userRow) => {
  createOrEditFlag.value = false;
  titleAddEdit.value = t('edit').concat(' ').concat('Utilizador');
  user.value = userRow;
  //activeEditDialog.value = true;
  show_dialog.value = true;
  //editedIndex.value = 0;
  console.log(newPass.value);
};

const viewUser = (userRow) => {
  titleDetails.value = t('view').concat(' ').concat('Utilizador');
  user.value = userRow;
  activeDetails.value = true;
  details_dialog.value = true;
};

const removeUser = (userRow) => {
  user.value = userRow;
  params.username_user = user.value.username;
  params.operation_type_user = 'D';

  const logedUser = localStorage.getItem('user');

  if (logedUser != params.username_user) {
    confirm(
      t('confirmation'),
      'Deseja apagar o utilizador '.concat(user.value.username).concat('?')
    )
      .onOk(() => {
        SecUsersService.post(params)
          .then(() => {
            submitting.value = false;
            close();
          })
          .catch(() => {
            submitting.value = false;
          });
      })
      .onCancel(() => {
        close();
      })
      .onDismiss(() => {
        close();
      });
  } else {
    alert(
      'Erro!',
      'O utilizador '
        .concat(user.value.username)
        .concat(' não pode ser removido porque está logado.'),
      null,
      null,
      null
    );
  }
};

const close = () => {
  activeDetails.value = false;
  show_dialog.value = false;
  details_dialog.value = false;
  activeEditDialog.value = false;
  user.value = [];
  editedIndex.value = -1;
  newPass.value = '';
  confirmPassword.value = '';
};

provide('title', titleAddEdit);
provide('titleList', titleList);
provide('titleDetails', titleDetails);
provide('show_dialog', show_dialog);
provide('details_dialog', details_dialog);
provide('submitting', submitting);
provide('editUser', editUser);
provide('viewUser', viewUser);
provide('removeUser', removeUser);
provide('user', user);
provide('close', close);
provide('createOrUpdate', createOrUpdate);
provide('newPass', newPass);
provide('createOrEditFlag', createOrEditFlag);
provide('confirmPassword', confirmPassword);
</script>
