import { RouteRecordRaw } from 'vue-router';
import Login from 'pages/Login/Login.vue';
import Logout from 'pages/Logout/Logout.vue';
import IndexPage from 'pages/IndexPage.vue';
import ErrorNotFound from 'pages/ErrorNotFound.vue';
import MainLayout from 'layouts/MainLayout.vue';
import Settings from 'pages/Settings/Settings.vue';
import Patients from 'pages/Patients/Patients.vue';
import ClinicDetails from '../pages/Clinic/Clinic.vue';
import stock from 'pages/Stock/Stock.vue';
import report from 'pages/reports/Report.vue';
import Dashboard from '../pages/Dashboard/Dashboard.vue';
import menusAcess from '../use/menusAcessUtils';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: MainLayout,
    beforeEnter(to, from, next) {
      next();
      // const authUser = localStorage.getItem('user');
      // if (authUser === null || String(authUser).includes('null')) {
      //   next('/Login');
      // } else {
      //   next();
      // }
    },
    children: [
      {
        path: '',
        component: IndexPage,
      },
      {
        path: '/Settings',
        component: Settings,
        beforeEnter(to, from, next) {
          if (!menusAcess.menusVisible('Parametro')) {
            next('/:catchAll(.*)*');
          } else {
            next();
          }
        },
      },
      {
        path: '/stock',
        component: stock,
        beforeEnter(to, from, next) {
          if (!menusAcess.menusVisible('Stock')) {
            next('/:catchAll(.*)*');
          } else {
            next();
          }
        },
      },
      {
        path: '/reports',
        component: report,
        beforeEnter(to, from, next) {
          if (!menusAcess.menusVisible('Relatorios')) {
            next('/:catchAll(.*)*');
          } else {
            next();
          }
        },
      },
      {
        path: '/clinic:id',
        component: ClinicDetails,
      },
      {
        path: '/dashboard',
        component: Dashboard,
        beforeEnter(to, from, next) {
          if (!menusAcess.menusVisible('Dashboard')) {
            next('/:catchAll(.*)*');
          } else {
            next();
          }
        },
      },
      {
        path: '/patients',
        component: Patients,
        beforeEnter(to, from, next) {
          if (!menusAcess.menusVisible('Pacientes')) {
            next('/:catchAll(.*)*');
          } else {
            next();
          }
        },
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
