<template>
  <q-page class="q-pa-sm q-gutter-sm">
    <listUser
      :columns="columns"
      :with_downloadButton="true"
      :rows="allSecUsers"
      :title="title"
      :with_actionRemoveButton="false"
      :with_actionEditButton="false"
      :with_actionDetailButton="false"
      :editar="editUser"
      :visualizar="viewUser"
      :remover="removeUser"
      :with_activeButton="false"
      :promptToConfirm="promptToConfirm"
    />
  </q-page>
</template>

<script setup>
import { useQuasar } from 'quasar';
import SecUsersService from 'src/services/secUsersService/SecUsersService';
import { computed, inject, onMounted, reactive, ref } from 'vue';
import listUser from 'src/components/Shared/CRUD/TableListActiveButton.vue';
import ProfileService from 'src/services/secUsersService/ProfileService';
import MenuService from 'src/services/secUsersService/MenuService';

/*
Declarations
*/
const title = ref('Lista de Utilizadores');

const viewUser = inject('viewUser');
// const newPass = inject('newPass');
// const currentPassword = inject('currentPassword');
const editUser = inject('editUser');
const removeUser = inject('removeUser');
const promptToConfirm = inject('promptToConfirm');
// const title = inject('titleList');
const $q = new useQuasar();

const columns = [
  {
    name: 'username',
    required: true,
    label: 'Utilizador',
    align: 'left',
    field: (row) => row.username,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'nome',
    required: true,
    label: 'Nome do Utilizador',
    align: 'left',
    field: (row) => row.nome + ' ' + row.apelido,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'role',
    required: true,
    label: 'Perfil',
    align: 'left',
    field: (row) =>
      row.profiles.length > 0
        ? row.profiles.flatMap((perfil) => '- ' + perfil.description + ' -')
        : 'Sem perfil associado',
    format: (val) => `${val}`,
    sortable: true,
  },
];
/*
  Mounted Hooks
*/
onMounted(() => {
  // getAllProfilesFromAPI(0);
  getAllSecUsersFromAPI(0);
});

/*
  Computed
*/

const allSecUsers = computed(() => {
  return SecUsersService.getAllSecUsers();
});

/*
  Methods
*/

const getAllSecUsersFromAPI = (offset) => {
  if (offset >= 0) {
    SecUsersService.get(offset);
  }
  setTimeout(() => {
    $q.loading.hide();
  }, 600);
};

const getAllProfilesFromAPI = (offset) => {
  if (offset >= 0) {
    ProfileService.get(offset);
  }
  setTimeout(() => {
    $q.loading.hide();
  }, 600);
};

const getAllMenusFromAPI = (offset) => {
  if (offset >= 0) {
    MenuService.get(offset);
  }
  setTimeout(() => {
    $q.loading.hide();
  }, 600);
};

// provide('profiles', profiles);
</script>
