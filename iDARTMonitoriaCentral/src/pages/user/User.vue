<template>
  <q-page class="q-pa-sm q-gutter-sm">
    <UserHome :is="activeUserHome" v-model:title="titleList" />
    <UserDetailsVue :is="activeDetails" v-model:title="titleDetails" />
    <CreateEditUser />

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
import { provide, reactive, ref } from 'vue';
import SecUsersService from 'src/services/secUsersService/SecUsersService';
import LoginService from 'src/services/loginService/LoginService';
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
const localEntity = ref([]);
const editedIndex = reactive(ref(0));
const activeUserHome = reactive(ref(true));
const activeEditDialog = reactive(ref(false));
const activeDetails = reactive(ref(false));
const { t } = useI18n();

const details_dialog = reactive(ref(false));
let createOrEditFlag = reactive(ref(false));
let confirmPassword = reactive(ref(''));
const newUserFlag = reactive(ref(false));

provide('title', titleAddEdit);
provide('show_dialog', show_dialog);
provide('submitting', submitting);
let newPass = reactive(ref(''));
const currentPassword = reactive(ref(''));

/**
 * Declarations
 */

let params = {
  username_user: '',
  pass_user: '',
  role_user: '',
  user_firstname: '',
  user_lastname: '',
  user_email: '',
  user_uuid: '',
  user_contact: '',
  profile_description: [],
  operation_type_user: '',
};

/*
  Methods
*/

const createUser = () => {
  createOrEditFlag.value = false;
  newUserFlag.value = true;
  titleAddEdit.value = t('add').concat(' ').concat('Utilizador');
  user.value = reactive(SecUsersService.newInstanceEntity());
  activeEditDialog.value = true;
  show_dialog.value = true;
  editedIndex.value = 1;
};

const updateUser = (userRow) => {
  params.user_firstname = userRow.nome;
  params.user_lastname = userRow.apelido;
  params.user_email = userRow.email;
  params.user_uuid = userRow.userid;
  params.user_contact = userRow.contacto;
  params.pass_user = '';
  params.role_user = userRow.role;
  params.username_user = userRow.username;
  params.profile_description = []
  userRow.value.profiles.forEach(element => {
      params.profile_description.push(element.description)
     });
       const menus2 = JSON.stringify(params.profile_description).replace(/\[/g, '{').replace(/]/g, '}')
       params.profile_description = menus2
  params.operation_type_user = 'U';
  SecUsersService.post(params,userRow.value.profiles);
};
const promptToConfirm = (userRow) => {
  let active = userRow.role === 'authenticator';

  confirm(
    t('confirmation'),
    active
      ? 'Deseja Inactivar o '.concat(t('user')).concat('?')
      : 'Deseja Activar o '.concat(t('user')).concat('?')
  )
    .onOk(() => {
      const logedUser = localStorage.getItem('user');
      if (logedUser != userRow.username) {
        if (active) {
          userRow.role = 'anon';
        } else if (!active) {
          userRow.role = 'authenticator';
        }
        updateUser(userRow);
      } else {
        alert(
          'Erro!',
          'O utilizador '
            .concat(userRow.username)
            .concat(' não pode ser alterado o seu estado.'),
          null,
          null,
          null
        );
      }
    })
    .onCancel(() => {
      close();
    })
    .onDismiss(() => {
      close();
    });
};

const createOrUpdate = () => {
  if (confirmPassword.value == newPass.value) {
    params.user_firstname = user.value.nome;
    params.user_lastname = user.value.apelido;
    params.user_email = user.value.email;
    params.user_uuid = user.value.userid;
    params.user_contact = user.value.contacto;
    params.pass_user = newPass.value;
    params.role_user = 'authenticator';
    params.username_user = user.value.username;
    params.profile_description = []
    user.value.profiles.forEach(element => {
      params.profile_description.push(element.description)
     });
       const menus2 = JSON.stringify(params.profile_description).replace(/\[/g, '{').replace(/]/g, '}')
       params.profile_description = menus2
    submitting.value = true;

    if (editedIndex.value != 1) {
      LoginService.validatePassword({
        username: user.value.username,
        pass: currentPassword.value,
      })
        .then((response) => {
          const token = response.data[0].token;
          if (response != 'undefined' && token.length > 0) {
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
            alert(
              'Erro!',
              'Introduziu uma senha actual inválida',
              null,
              null,
              null
            );
            submitting.value = false;
          }
        })
        .catch(() => {
          alert(
            'Erro!',
            'Introduziu uma senha actual inválida',
            null,
            null,
            null
          );
          submitting.value = false;
        });
    } else {
      //  delete user.value['username'];
      params.operation_type_user = 'C';
      SecUsersService.post(params, user.value.profiles)
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
  createOrEditFlag.value = true;
  newUserFlag.value = true;
  titleAddEdit.value = t('edit').concat(' ').concat('Utilizador');
  user.value = userRow;
  show_dialog.value = true;
  editedIndex.value = 0;
};

const viewUser = (userRow) => {
  titleDetails.value = t('view').concat(' ').concat('Utilizador');
  user.value = userRow;
  activeDetails.value = true;
  details_dialog.value = true;

  localEntity.value.username = user.value.username;
  localEntity.value.nome = String(user.value.nome)
    .concat(' ')
    .concat(user.value.apelido);
  localEntity.value.contacto = user.value.contacto;
  localEntity.value.email = user.value.email;
  localEntity.value.role = user.value.role;
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
provide('createOrEditFlag', createOrEditFlag);
provide('newUserFlag', newUserFlag);
provide('confirmPassword', confirmPassword);
provide('newPass', newPass);
provide('currentPassword', currentPassword);
provide('promptToConfirm', promptToConfirm);
provide('localEntity', localEntity);
</script>
