<template>
  <q-page class="q-pa-sm q-gutter-sm">
    <listRoles
      :columns="columns"
      :rows="profiles"
      :title="title"
      :with_downloadButton="true"
      :with_activeButton="true"
      :with_actionDetailButton="true"
      :with_actionEditButton="true"
      :with_actionRemoveButton="false"
      :editar="editProfile"
      :visualizar="viewProfile"
      :promptToConfirm="promptToConfirm"
    />
  </q-page>
</template>

<script setup>
import { useQuasar } from 'quasar';
import MenuService from 'src/services/secUsersService/MenuService';
import { computed, inject, onMounted, reactive, ref, provide } from 'vue';
import listRoles from 'src/components/Shared/CRUD/TableListActiveButton.vue';
import ProfileService from 'src/services/secUsersService/ProfileService';

/*
  Declarations
  */
const title = ref('Lista de Perfis');
const viewProfile = inject('viewProfile');
const editProfile = inject('editProfile');
const promptToConfirm = inject('promptToConfirm');
const $q = new useQuasar();
//const menus = inject('menus');

const columns = [
  {
    name: 'description',
    required: true,
    label: 'Descrição',
    align: 'left',
    field: (row) => row.description,
    format: (val) => `${val}`,
    sortable: true,
  },
];
/*
    Mounted Hooks
  */
onMounted(() => {
  getAllMenusFromAPI(0);
  getAllProfilesFromAPI(0);
});

/*
    Computed
  */

const profiles = computed(() => {
  return ProfileService.getAllProfiles();
});

/*
    Methods
  */

const getAllMenusFromAPI = (offset) => {
  if (offset >= 0) {
    MenuService.get(offset);
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

provide('profiles', profiles);
</script>
