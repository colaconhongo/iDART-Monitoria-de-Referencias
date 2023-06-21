<template>
  <q-page class="q-pa-sm q-gutter-sm">
    <Roles :is="activeProfileHome" v-model:title="titleList" />
    <CreateEditProfile></CreateEditProfile>
    <ProfileDetails :is="activeDetails" v-model:title="titleDetails" />
    <div class="absolute-bottom">
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn
          size="xl"
          fab
          icon="add"
          @click="createProfile()"
          color="primary"
        />
      </q-page-sticky>
    </div>
  </q-page>
</template>
<script setup>
import Roles from 'src/components/user/Roles.vue';
import CreateEditProfile from 'src/components/user/RolesCreateEditModal.vue';
import ProfileDetails from 'src/components/user/ProfileDetails.vue';
import { provide, reactive, ref } from 'vue';
import ProfileService from 'src/services/secUsersService/ProfileService';
import { confirm } from 'src/components/Shared/Directives/Plugins/Dialog/dialog';
import { useI18n } from 'vue-i18n';
import { alert } from 'src/components/Shared/Directives/Plugins/Dialog/dialog';

/*
  Declarations
  */
const titleList = ref('Perfil');
const titleAddEdit = reactive(ref('Dados do Perfil'));
const titleDetails = reactive(ref('Detalhes do Perfil'));
const show_dialog = reactive(ref(false));
const submitting = reactive(ref(false));
const profile = reactive(ref([]));
const localEntity = ref([]);
const editedIndex = reactive(ref(0));
const activeProfileHome = reactive(ref(true));
const activeEditDialog = reactive(ref(false));
const activeDetails = reactive(ref(false));
const { t } = useI18n();

const details_dialog = reactive(ref(false));
let createOrEditFlag = reactive(ref(false));
const newUserFlag = reactive(ref(false));

/**
 * Declarations
 */

let params = {
  profiles_id: 0,
  operation_type_user: '',
  profile_description: '',
  active_state: '',
  menu_codes: [],
};

/*
    Methods
  */

const createProfile = () => {
  createOrEditFlag.value = true;
  newUserFlag.value = true;
  titleAddEdit.value = t('add').concat(' ').concat('Perfil');
  profile.value = reactive(ProfileService.newInstanceEntity());
  activeEditDialog.value = true;
  show_dialog.value = true;
  editedIndex.value = 1;
};

const promptToConfirm = (profileRow) => {
  confirm(
    t('confirmation'),
    profileRow.active
      ? 'Deseja Inactivar o '.concat(t('role')).concat('?')
      : 'Deseja Activar o '.concat(t('role')).concat('?')
  )
    .onOk(() => {
      if (profileRow.active) {
        profileRow.active = false;
      } else if (!profileRow.active) {
        profileRow.active = true;
      }
      addParamsToInactivateProfile(profileRow);
      ProfileService.post(params, profileRow.menus);
    })
    .onCancel(() => {
      close();
    })
    .onDismiss(() => {
      close();
    });
};

const createOrUpdate = () => {
  if (newUserFlag.value === true) {
    addDataParamsProfile(profile);
    params.operation_type_user = 'C';
  } else if (newUserFlag.value === false) {
    addDataParamsProfile(profile);
    params.operation_type_user = 'U';
  }
  ProfileService.post(params, profile.value.menus)
    .then(() => {
      submitting.value = false;
      close();
    })
    .catch((error) => {
      submitting.value = false;
      if (error.request != null) {
        const arrayErrors = codeRules(JSON.parse(error.request.response));
        alert('Erro no registo', arrayErrors, null, null, null);
      }
    });
};

const editProfile = (profileRow) => {
  createOrEditFlag.value = true;
  newUserFlag.value = false;
  titleAddEdit.value = t('edit').concat(' ').concat('Perfil');
  profile.value = profileRow;
  show_dialog.value = true;
  editedIndex.value = 0;
};

const addDataParamsProfile = (profileRow) => {
  params.profiles_id = profileRow.value.id;
  params.profile_description = profileRow.value.description;
  params.active_state = true;
  params.menu_codes = [];
  profileRow.value.menus.forEach((element) => {
    params.menu_codes.push(element.code);
  });
  const menus2 = JSON.stringify(params.menu_codes)
    .replace(/\[/g, '{')
    .replace(/]/g, '}');
  params.menu_codes = menus2;
  return params;
};

const addParamsToInactivateProfile = (profileRow) => {
  params.profiles_id = profileRow.id;
  params.profile_description = profileRow.description;
  params.active_state = profileRow.active;
  params.menu_codes = [];
  profileRow.menus.forEach((element) => {
    params.menu_codes.push(element.code);
  });
  const menus2 = JSON.stringify(params.menu_codes)
    .replace(/\[/g, '{')
    .replace(/]/g, '}');
  params.menu_codes = menus2;
  params.operation_type_user = 'I';
  return params;
};

const viewProfile = (profileRow) => {
  titleDetails.value = t('view').concat(' ').concat('Utilizador');
  profile.value = profileRow;
  activeDetails.value = true;
  details_dialog.value = true;

  localEntity.value.description = profile.value.description;
  localEntity.value.menus = profile.value.menus.flatMap(
    (menu) => menu.description
  );
};

const close = () => {
  activeDetails.value = false;
  show_dialog.value = false;
  details_dialog.value = false;
  activeEditDialog.value = false;
  profile.value = [];
  editedIndex.value = -1;
};

const codeRules = (val) => {
  if (val.code == 23505) {
    return t(val.code);
  }
};

provide('title', titleAddEdit);
provide('titleDetails', titleDetails);
provide('show_dialog', show_dialog);
provide('details_dialog', details_dialog);
provide('submitting', submitting);
provide('editProfile', editProfile);
provide('viewProfile', viewProfile);
provide('profile', profile);
provide('close', close);
provide('createOrUpdate', createOrUpdate);
provide('createOrEditFlag', createOrEditFlag);
provide('newUserFlag', newUserFlag);
provide('localEntity', localEntity);
provide('promptToConfirm', promptToConfirm);
</script>
