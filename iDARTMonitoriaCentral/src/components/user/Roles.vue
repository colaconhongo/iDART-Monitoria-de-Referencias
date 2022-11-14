<template>
    <q-page class="q-pa-sm q-gutter-sm">
      <listRoles
        :columns="columns"
        :mode="mode"
        :rows="profiles"
        :title="props.title"
        :with_downloadButton="true"
      :with_activeButton="true"
      :with_actionDetailButton="true"
      :with_actionEditButton="true"
      :with_actionRemoveButton="false"
        :editar="editProfile"
        :visualizar="viewProfile"
        :remover="removeUser"
        :promptToConfirm="promptToConfirm"
        :isActive="isActive"
      />
    </q-page>
  </template>
  
  <script setup>
  import { useQuasar, QSpinnerBall } from 'quasar';
  import MenuService from 'src/services/secUsersService/MenuService';
  import { computed, inject, onMounted, reactive, ref, provide } from 'vue';
  import listRoles from 'src/components/Shared/CRUD/TableListActiveButton.vue';
  import { useI18n } from 'vue-i18n';
import ProfileService from 'src/services/secUsersService/ProfileService';
  
  const props = defineProps({
    title: {
      type: String,
    },
  });
  
  /*
  Declarations
  */
  const viewProfile = inject('viewProfile');
  const editProfile = inject('editProfile');
  const removeUser = inject('removeUser');
  const promptToConfirm = inject('promptToConfirm');
  const title = inject('titleList');
  const $q = new useQuasar();
  const { t } = useI18n();
  const mode = reactive(ref('list'));
  //const menus = inject('menus');

  
  const columns = [
    {
      name: 'description',
      required: true,
      label: t('description'),
      align: 'left',
      field: (row) => row.description,
      format: (val) => `${val}`,
      sortable: true,
    }
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
    }, 800);
    getAllMenusFromAPI(0);
    getAllProfilesFromAPI(0);
  });
  
  /*
    Computed
  */
  
  const menus = reactive(
    computed(() => {
      return MenuService.getAllFromStorage();
    })
  );

  const profiles = reactive(
    computed(() => {
      return ProfileService.getAllProfiles();
    })
  );

  
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
  
  console.log(profiles)
  provide('profiles', profiles);


  </script>
  