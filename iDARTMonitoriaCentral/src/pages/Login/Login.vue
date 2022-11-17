<template>
  <q-layout v-cloak>
    <q-page-container>
      <q-page class="flex flex-center">
        <div
          id="particles-js"
          :class="$q.dark.isActive ? 'dark_gradient' : 'normal_gradient'"
        ></div>
        <q-btn
          color="white"
          class="absolute-top-right"
          flat
          round
          @click="$q.dark.toggle()"
          :icon="$q.dark.isActive ? 'nights_stay' : 'wb_sunny'"
        />
        <transition
          appear
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
        >
          <q-card
            v-bind:style="
              $q.screen.lt.sm
                ? { width: '80%' }
                : { width: '50%', height: '850px', 'border-radius': '50%' }
            "
          >
            <q-card-section align="center">
              <div class="row justify-center q-gutter-xl">
                <div class="justify-left q-py-xl">
                  <q-avatar round size="120px" style="opacity: 40%">
                    <q-img src="../../assets/MoHLogo.png" />
                  </q-avatar>
                </div>
                <div class="justify-right q-pt-sm">
                  <q-avatar square size="190px" style="opacity: 40%">
                    <q-img src="../../assets/pepfar-new-logo.jpeg" />
                  </q-avatar>
                </div>
              </div>
            </q-card-section>
            <q-card-section>
              <div class="row text-center column">
                <div
                  style="font-size: 26px"
                  class="row text-center column text-gray text-subtitle1 ellipsis"
                >
                  iDART - Sistema de Monitoria de Dados para
                </div>
                <div
                  style="font-size: 26px"
                  class="row text-center column text-gray text-subtitle1 ellipsis"
                >
                  Pacientes Referidos
                </div>
              </div>
            </q-card-section>
            <q-card-section align="center">
              <q-form @submit.prevent="processForm" class="q-gutter-md">
                <div class="row justify-between">
                  <div
                    class="col-5 q-pa-sm q-pl-xl q-ml-xl text-center justify-center"
                  >
                    <div class="row q-mb-sm">
                      <q-input
                        class="col"
                        ref="user"
                        v-model="username"
                        type="text"
                        :rules="[
                          (val) =>
                            val.length >= 4 ||
                            'O nome do utilizador deve ter um minimo de 4 caracteres',
                        ]"
                        lazy-rules
                        label="Utilizador"
                      >
                        <template v-slot:append>
                          <q-icon name="person" color="primary" />
                        </template>
                      </q-input>
                    </div>
                    <div class="row q-mb-sm">
                      <q-input
                        v-model="password"
                        class="col"
                        label="Senha"
                        :type="isPwd ? 'password' : 'text'"
                        :rules="[
                          (val) =>
                            val.length >= 4 ||
                            'A senha deve ter um minimo de 4 caracteres',
                        ]"
                      >
                        <template v-slot:append>
                          <q-icon
                            :name="isPwd ? 'visibility_off' : 'visibility'"
                            class="cursor-pointer"
                            @click="isPwd = !isPwd"
                            color="primary"
                          />
                        </template>
                      </q-input>
                    </div>
                    <div class="row q-mb-sm">
                      <q-select
                        label="Província"
                        tack-label
                        class="col"
                        v-model="provincia"
                        use-input
                        fill-input
                        hide-selected
                        :options="allProvincias"
                        option-label="name"
                        option-value="id"
                      >
                        <template v-slot:no-option>
                          <q-item>
                            <q-item-section class="text-grey">
                              No results
                            </q-item-section>
                          </q-item>
                        </template>
                      </q-select>
                    </div>
                  </div>
                  <div
                    class="col-6 text-grey text-caption no-wrap items-center justify-center"
                  >
                    <div class="row justify-center q-pb-md rotateLogo">
                      <q-avatar size="160px">
                        <q-img
                          class="bg-white rotatings"
                          src="../../assets/LogoMonitoria.png"
                        />
                      </q-avatar>
                    </div>
                    <div class="row justify-center">
                      <q-btn
                        :loading="submitting"
                        class="btn-fixed-width q-py-md"
                        unelevated
                        rounded
                        color="primary"
                        type="submit"
                        label="Entrar"
                      />
                    </div>
                  </div>
                </div>
              </q-form>
              <div class="row justify-center q-pb-md">
                <q-avatar round size="100px">
                  <q-img src="../../assets/logo_graphic.png" />
                </q-avatar>
              </div>
              <div class="row justify-center">Versão v.1.2.0</div>
            </q-card-section>
          </q-card>
        </transition>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useQuasar } from 'quasar';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '../../services/loginService/LoginService';
import ProvinceService from 'src/services/provinceService/provinceService';
import menuService from 'src/services/secUsersService/MenuService';
import profileService from 'src/services/secUsersService/ProfileService';
import secUsersService from 'src/services/secUsersService/SecUsersService';
import { ShowNotification } from '../../components/Shared/Directives/Plugins/Notify/notify';

/*
  Declaration
*/
const $q = useQuasar();
const username = ref('');
const password = ref('');
const isPwd = ref(true);
const submitting = ref(false);
const router = useRouter();
const provincia = ref([]);
const accessGranted = ref(true);

/*
  Computed
*/
const allProvincias = computed(() => {
  return ProvinceService.getAllFromStorage();
});
/*
   On Page Mounted
*/
onMounted(() => {
  ProvinceService.get(0);
});

/*
  Methods
*/
const processForm = () => {
  submitting.value = true;
  login({
    username: username.value,
    pass: password.value,
  }).then((response) => {
    if (response) {
      localStorage.setItem('user', username.value);
      localStorage.setItem('token', response.data[0].token);
      localStorage.setItem('refresh_token', response.data[0].token);
      localStorage.setItem('province_id', provincia.value.id);
      localStorage.setItem('province_name', provincia.value.name);

      addUserAcess();
    } else {
      router.push({ path: '/login' });
    }
    submitting.value = false;
  });
};

const addUserAcess = () => {
  menuService.get(0).then((menus) => {
    profileService.get(0).then((profiles) => {
      secUsersService.get(0).then((secUsers) => {
        const secUser = secUsersService.getSecUsersByUserName(
          localStorage.getItem('user')
        );
        const profilesDescription = [];
        if (localStorage.getItem('user') !== 'postgres') {
          secUser[0].profiles.forEach((element) => {
            profilesDescription.push(element.description);
          });
          const profilesFromStorage =
            profileService.getWhereInDescription(profilesDescription);

          if (!profilesFromStorage.length > 0) {
            accessGranted.value = false;
          } else {
            accessGranted.value = true;
          }

          const menuSet = new Set();
          profilesFromStorage.forEach((element) => {
            element.menus.forEach((menu) => {
              menuSet.add(menu.description);
            });
          });
          const roles_menus = [];
          for (let item of menuSet) roles_menus.push(item);
          localStorage.setItem('role_menus', roles_menus);
        } else {
          const menuAll = [];
          const menus = menuService.getAllFromStorage();
          menus.forEach((menu) => {
            menuAll.push(menu.description);
          });
          localStorage.setItem('role_menus', menuAll);
        }

        if (accessGranted.value) {
          router.push({ path: '/' });
        } else {
          router.push({ path: '/Logout' });

          ShowNotification(
            'announcement',
            'Utilizador sem permissão ou Senha inválida, por favor contacte o Administrador ',
            'negative',
            true,
            4500,
            'center',
            'negative',
            'white',
            'glossy'
          );
        }
      });
    });
  });
};
</script>

<style>
.bg-image {
  background-repeat: no-repeat;
  background-size: cover;
}

[v-cloak] {
  display: none !important;
}
#particles-js {
  position: absolute;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;
}
.normal_gradient {
  background: linear-gradient(145deg, #00afdb 30%, #00bea4 70%);
}
.dark_gradient {
  background: linear-gradient(145deg, #014758 15%, #014b41 70%);
}
.login-form {
  position: absolute;
}
.btn-fixed-width {
  width: 250px;
}
@keyframes rotating {
  from {
    transform: rotateY(0deg);
    -o-transform: rotateY(0deg);
    -ms-transform: rotateY(0deg);
    -moz-transform: rotateY(0deg);
    -webkit-transform: rotateY(0deg);
  }
  to {
    transform: rotateY(360deg);
    -o-transform: rotateY(360deg);
    -ms-transform: rotateY(360deg);
    -moz-transform: rotateY(360deg);
    -webkit-transform: rotateY(360deg);
  }
}
@-webkit-keyframes rotating {
  from {
    transform: rotateY(0deg);
    -webkit-transform: rotateY(0deg);
  }
  to {
    transform: rotateY(360deg);
    -webkit-transform: rotateY(360deg);
  }
}
.rotatings {
  -webkit-animation: rotating 6s linear alternate-reverse infinite;
  -moz-animation: rotating 6s linear alternate-reverse infinite;
  -ms-animation: rotating 6s linear alternate-reverse infinite;
  -o-animation: rotating 6s linear alternate-reverseinfinite;
  animation: rotating 6s linear alternate-reverse infinite;
}
.rotating:hover {
  transform: rotate(360deg);
}
</style>
