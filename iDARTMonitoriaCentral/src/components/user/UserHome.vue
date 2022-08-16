<template>
  <q-page class="q-pa-sm q-gutter-sm">
    <listUser
      :columns="columns"
      :mode="mode"
      :with_downloadButton="true"
      :rows="allSecUsers"
      :title="props.title"
      :with_actionRemoveButton="true"
      :with_actionEditButton="true"
      :with_actionDetailButton="false"
      :editar="editUser"
      :remover="removeUser"
    />
  </q-page>
</template>

<script setup>
import { useQuasar, QSpinnerBall } from 'quasar';
import SecUsersService from 'src/services/secUsersService/SecUsersService';
import { computed, inject, onMounted, reactive, ref, watch } from 'vue';
import listUser from 'src/components/Shared/CRUD/TableList.vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  title: {
    type: String,
  },
});

/*
Declarations
*/
const viewUser = inject('viewUser');
const newPass = inject('newPass');
const editUser = inject('editUser');
const removeUser = inject('removeUser');
const title = inject('titleList');
const $q = new useQuasar();
const mode = reactive(ref('list'));

const columns = [
  {
    name: 'username',
    required: true,
    label: 'Username',
    align: 'left',
    field: (row) => row.username,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'role',
    align: 'left',
    label: 'Role',
    field: (row) => row.role,
    format: (val) => `${val}`,
    sortable: true,
  },
];
/*
  Mounted Hooks
*/
onMounted(() => {
  $q.loading.show({
    message: 'Carregando ...',
    spinnerColor: 'grey-4',
    spinner: QSpinnerBall,
  });
  setTimeout(() => {
    $q.loading.hide();
  }, 600);
  getAllSecUsersFromAPI(0);
});

/*
  Computed
*/

const allSecUsers = reactive(
  computed(() => {
    return SecUsersService.getAllSecUsers();
  })
);

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
</script>
