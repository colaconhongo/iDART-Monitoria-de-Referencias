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
                      >Dados do Perfil</span
                    >
                  </div>
                  <q-input
                  outlined
                  lazy-rules
                  label="Nome"
                  class="col q-ml-md"
                  ref="descriptionRef"
                  v-model="profile.description"
                  :rules="[val => codeRules (val)]"
                />
                </div>
                <div class="q-pa-md">
                    <q-table
                       title="Funcionalidades"
                       :rows="menus"
                       :columns="columns"
                       row-key="code"
                       selection="multiple"
                       v-model:selected="profile.menus"
                       class="my-sticky-header-table"
                         v-if="!onlyView"
                       rows-per-page-options="8"
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
  import { inject, ref, reactive, computed, onMounted} from 'vue';
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
  const createOrEditFlag = inject('createOrEditFlag');
  const newUserFlag = inject('newUserFlag');
  const isPwd = ref(true);
  const isNewPwd = ref(true);
  const isPwdConf = ref(true);
  const options = ref([]);
  const roleOps = ref('Authenticator');
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
    }
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
  const validateForm1 = () => {
    console.log(menus.value)
    console.log(profile.value)
           createOrUpdate();
      };


const validateForm = () => {
  
  if (profile.value.menus.length <= 0) alert(
              'Erro!',
              'Tem de Selecionar Pelo menos 1 Menu',
              null,
              null,
              null
            );

    descriptionRef.value.validate();
    if (
      !descriptionRef.value.hasError &&
      profile.value.menus.length > 0
    ) {
      createOrUpdate();
    }
};

const databaseCodes = () =>  {
  console.log(profiles.value)
      profiles.value.forEach(element => {
        databaseDescriptions.value.push(element.description)
    })
   // return databaseDescriptions
    }

   const codeRules = (val) => {
    console.log(databaseDescriptions.value)
       if (profile.value.description.length !== 0 && profile.value.id === profile.value.id) {
      return !databaseDescriptions.value.includes(val) || 'A descricao indicada ja existe'
         }
    }

  /*
    Mounted Hooks
  */
  onMounted(() => {
    console.log(profiles)
    databaseCodes();
  });

 const menus =reactive(
    computed(() => {
      return MenuService.getAllFromStorage();
    })
  );

  const profiles = reactive(
    computed(() => {
      return ProfileService.getAllProfiles();
    })
  );
  </script>
  