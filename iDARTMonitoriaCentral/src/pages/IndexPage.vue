<template>
  <q-page class="justify-evenly q-pt-lg">
    <div class="row justify-center rotateLogo">
      <q-avatar size="100px">
        <img class="bg-white rotatings" src="../assets/LogoMonitoria.png" />
      </q-avatar>
    </div>
    <div class="row q-py-xl q-gutter-lg justify-center">
      <div class="shadow-box">
        <q-btn
          class="btn-fixed-width q-px-sm q-py-md shadow-24"
          color="blue-8"
          rounded
          push
          glossy
          @click="$router.push('/dashboard')"
          v-if="menusVisible('Dashboard')"
        >
          <div class="row"></div>
          <q-icon size="80px" name="pie_chart" />
          <div
            class="text-bold"
            style="font-family: 'Arial Rounded MT Bold'; font-size: 20px"
          >
            Dashboard
          </div></q-btn
        >
      </div>
      <div class="">
        <q-btn
          class="btn-fixed-width q-px-sm q-py-md shadow-24"
          color="blue-8"
          glossy
          push
          rounded
          @click="$router.push('/patients')"
          v-if="menusVisible('Pacientes')"
        >
          <div class="row"></div>
          <q-icon size="80px" name="person_search" />
          <div
            class="text-bold"
            style="font-family: 'Arial Rounded MT Bold'; font-size: 20px"
          >
            Pacientes
          </div>
        </q-btn>
      </div>
      <div class="">
        <q-btn
          class="btn-fixed-width q-px-md q-py-sm shadow-24"
          color="blue-8"
          push
          glossy
          rounded
          @click="$router.push('/stock')"
          v-if="menusVisible('Stock')"
        >
          <div class="row"></div>
          <q-icon size="95px" name="medication" />
          <div
            class="text-bold"
            style="font-family: 'Arial Rounded MT Bold'; font-size: 20px"
          >
            Stock
          </div>
        </q-btn>
      </div>
    </div>
    <div class="row q-py-xl q-gutter-lg justify-center">
      <div class="">
        <q-btn
          class="btn-fixed-width q-px-sm q-py-md shadow-up-24"
          color="blue-8"
          glossy
          rounded
          push
          @click="$router.push('/reports')"
          v-if="menusVisible('Relatorios')"
        >
          <div class="row"></div>
          <q-icon size="80px" name="list_alt" />
          <div
            class="text-bold"
            style="font-family: 'Arial Rounded MT Bold'; font-size: 20px"
          >
            Relatório
          </div></q-btn
        >
      </div>
      <div class="">
        <q-btn
          class="btn-fixed-width q-px-sm q-py-md shadow-up-24"
          color="blue-8"
          glossy
          push
          rounded
          @click="$router.push('/settings')"
          v-if="menusVisible('Parametro')"
        >
          <div class="row"></div>
          <q-icon size="80px" name="settings" />
          <div
            class="text-bold"
            style="font-family: 'Arial Rounded MT Bold'; font-size: 20px"
          >
            Parâmetro
          </div>
        </q-btn>
      </div>
    </div>
  </q-page>
</template>
<script setup>
import { useQuasar, QSpinnerBall } from 'quasar';
import districtService from 'src/services/districtService/districtService';
import provinceService from 'src/services/provinceService/provinceService';
import clinicService from 'src/services/clinicService/clinicService';
import menuService from 'src/services/secUsersService/MenuService';
import profileService from 'src/services/secUsersService/ProfileService';
import secUsersService from 'src/services/secUsersService/SecUsersService';
import { onMounted, onUpdated } from 'vue';

/*
  Declaration
*/

const $q = useQuasar();
/*
  Mounted Hooks
*/
onUpdated ==
  onMounted(() => {
    $q.loading.show({
      message: 'Carregando ...',
      spinnerColor: 'grey-4',
      spinner: QSpinnerBall,
    });
    $q.loading.hide();
  //  menuService.get(0);
    provinceService.get(0);
    districtService.get(0);
    clinicService.get(0);
  });

  const menusVisible = (name) => {
        const menus = localStorage.getItem('role_menus')
        if(menus !== null && menus.length > 0) {
        if (!menus.includes(name)) {
               return false
        } else {
          return true
        }
      }
  }
</script>
<style scoped>
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
  -webkit-animation: rotating 3s linear alternate-reverse infinite;
  -moz-animation: rotating 3s linear alternate-reverse infinite;
  -ms-animation: rotating 3s linear alternate-reverse infinite;
  -o-animation: rotating 3s linear alternate-reverseinfinite;
  animation: rotating 3s linear alternate-reverse infinite;
}
.rotating:hover {
  transform: rotate(360deg);
}
</style>
