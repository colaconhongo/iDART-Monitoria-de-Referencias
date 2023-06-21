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
                  <span class="q-pl-sm text-subtitle2">Dados do Perfil</span>
                </div>
                <q-input
                  outlined
                  lazy-rules
                  dense
                  label="Nome"
                  class="col q-ml-md"
                  ref="descriptionRef"
                  v-model="profile.description"
                />
              </div>
              <div class="q-pa-md">
                <q-table
                  title="Funcionalidades"
                  dense
                  :rows="menus"
                  :columns="columns"
                  row-key="code"
                  selection="multiple"
                  v-model:selected="profile.menus"
                  class="my-sticky-header-table"
                >
                </q-table>
              </div>
            </div>
          </q-form>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn
            v-close-popup
            color="negative"
            label="Cancelar"
            type="reset"
            @click="close"
          />
          <q-btn
            :loading="submitting"
            color="teal"
            label="Gravar"
            type="submit"
            @click.stop="validateForm"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script setup>
import { inject, ref, reactive, computed, onMounted } from 'vue';
import MenuService from 'src/services/secUsersService/MenuService';
import ProfileService from 'src/services/secUsersService/ProfileService';
import { useI18n } from 'vue-i18n';
import { alert } from '../../components/Shared/Directives/Plugins/Dialog/dialog';
const descriptionRef = ref(null);
const createOrUpdate = inject('createOrUpdate');
const profile = inject('profile');
const close = inject('close');
const title = inject('title');
const show_dialog = inject('show_dialog');
const submitting = inject('submitting');
// const createOrEditFlag = inject('createOrEditFlag');
// const newUserFlag = inject('newUserFlag');
// const isPwd = ref(true);
// const isNewPwd = ref(true);
// const isPwdConf = ref(true);
// const options = ref([]);
// const roleOps = ref('Authenticator');
// const profiles = inject('profiles');
const databaseDescriptions = ref([]);
const { t } = useI18n();

const columns = [
  {
    name: 'description',
    required: true,
    label: t('description'),
    align: 'left',
    field: (row) => row.description,
    format: (val) => `${val}`,
    sortable: true,
  },
];

/*
    Props
  */

/*
    Provides
    */

/*
   Methods
   */

const validateForm = () => {
  if (profile.value.menus.length <= 0)
    alert('Erro!', 'Tem de Selecionar Pelo menos 1 Menu', null, null, null);

  descriptionRef.value.validate();
  if (!descriptionRef.value.hasError && profile.value.menus.length > 0) {
    createOrUpdate();
  }
};

const databaseCodes = () => {
  profiles.value.forEach((element) => {
    databaseDescriptions.value.push(element.description);
  });
  // return databaseDescriptions
};

/*
    Mounted Hooks
  */
onMounted(() => {
  databaseCodes();
});

const menus = computed(() => {
  return MenuService.getAllFromStorage();
});

const profiles = computed(() => {
  return ProfileService.getAllProfiles();
});
</script>
