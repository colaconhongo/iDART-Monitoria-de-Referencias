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
                  Pacientes Referios
                </div>
              </div>
            </q-card-section>
            <q-card-section align="center">
              <q-form class="q-gutter-md" @submit.prevent="processForm">
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
                        option-label="designacao"
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
                    <div class="row justify-center q-pb-md">
                      <q-avatar size="160px">
                        <q-img src="../../assets/LogoMonitoria.png" />
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
              <div class="row justify-center">Versão v.1.0.0</div>
            </q-card-section>
          </q-card>
        </transition>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useQuasar } from 'quasar';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import LoginService from '../../services/loginService/LoginService';
import ProvinceService from 'src/services/provinceService/provinceService';

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

/*
  Computed
*/
const allProvincias = computed(() => {
  return ProvinceService.getAllFromStorage();
});
/*
   On Page Mounted

onMounted(() => {
  LoadJS.QSpinnerGearsShow('grey-4', '', '', '', 'Carregando ...');
  setTimeout(() => {
    LoadJS.closeLoading();
  }, 600);
});
/*
  Methods
*/
const processForm = () => {
  console.log({ username: username.value, pass: password.value });
  submitting.value = true;
  LoginService.login({
    username: username.value,
    pass: password.value,
  }).then((response) => {
    if (response) {
      console.log('Login >>>>>>>>', response); //.access_token);
      localStorage.setItem('user', username.value);
      localStorage.setItem('id_token', response.data[0].token);
      localStorage.setItem('refresh_token', response.data[0].token);

      router.push({ path: '/' });
    } else {
      router.push({ path: '/login' });
    }
    submitting.value = false;
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
</style>
