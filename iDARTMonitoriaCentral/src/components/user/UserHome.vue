<template>
  <q-page class="q-pa-sm q-gutter-sm">
    <listUser
      :columns="columns"
      :mode="mode"
      :with_downloadButton="true"
      :rows="allSecUsers"
      :title="props.title"
      :with_actionRemoveButton="false"
      :with_actionEditButton="true"
      :with_actionDetailButton="true"
      :editar="editUser"
      :visualizar="viewUser"
      :remover="removeUser"
      :with_activeButton="true"
      :promptToConfirm="promptToConfirm"
    />
  </q-page>
</template>

<script setup>
import { useQuasar, QSpinnerBall } from 'quasar';
import SecUsersService from 'src/services/secUsersService/SecUsersService';
import { computed, inject, onMounted, reactive, ref } from 'vue';
import listUser from 'src/components/Shared/CRUD/TableListActiveButton.vue';
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
const promptToConfirm = inject('promptToConfirm');
const title = inject('titleList');
const $q = new useQuasar();
const { t } = useI18n();
const mode = reactive(ref('list'));

const columns = [
  {
    name: 'username',
    required: true,
    label: t('Username'),
    align: 'left',
    field: (row) => row.username,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'nome',
    required: true,
    label: t('nameUser'),
    align: 'left',
    field: (row) => row.role + ' ' + row.apelido,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'active',
    align: 'left',
    label: t('active'),
    field: (row) => (row.role === 'authenticator' ? t('true') : t('false')),
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
