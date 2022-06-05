import { RouteRecordRaw } from 'vue-router';
import Login from 'pages/Login/Login.vue';
import Logout from 'pages/Logout/Logout.vue';
import IndexPage from 'pages/IndexPage.vue';
import ErrorNotFound from 'pages/ErrorNotFound.vue';
import MainLayout from 'layouts/MainLayout.vue';
import provinceIndex from 'pages/province/index.vue';
import Settings from 'pages/Settings/Settings.vue';
import Patientss from 'pages/patients/Patientss.vue';
import Patients from 'pages/patients/Patients.vue';
import ClinicDetails from '../pages/Clinic/Clinic.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: MainLayout,
    beforeEnter(to, from, next) {
      const authUser = localStorage.getItem('user');
      if (authUser === null || String(authUser).includes('null')) {
        next('/Login');
      } else {
        next();
      }
    },
    children: [
      {
        path: '',
        component: IndexPage,
      },
      {
        path: '/province',
        component: provinceIndex,
      },
      {
        path: '/settings',
        component: Settings,
      },
      {
        path: '/clinic:id',
        component: ClinicDetails,
      },
      {
        path: '/patients',
        component: Patients,
      },
    ],
  },
  {
    path: '/Login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false },
  },
  {
    path: '/Logout',
    name: 'Logout',
    component: Logout,
    meta: { requiresAuth: false },
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: ErrorNotFound,
  },
];

export default routes;
