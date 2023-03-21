<template>
  <q-layout view="lHh Lpr lFf" class="bg-gray">
    <div>
      <q-header>
        <q-toolbar>
          <q-avatar size="100px">
            <img class="bg-white" src="../assets/LogoMonitoria.png" />
          </q-avatar>
          <q-toolbar-title
            class="text-bold text-italic"
            style="font-family: 'Gill Sans'; font-size: 26px"
          >
            <div class="row column">
              <div>Monitoria de Dados</div>
            </div>
            <div>Pacientes Referidos</div>
          </q-toolbar-title>
          <q-tabs
            class="absolute-center"
            no-caps
            v-model="tab"
            active-color="orange"
            indicator-color="orange"
            align="justify"
            narrow-indicator
          >
            <q-route-tab
              exact
              default
              :to="'/dashboard'"
              name="dashboard"
              icon="pie_chart"
              label="Dashboard"
              v-if="menusVisible('Dashboard')"
            />
            <q-route-tab
              exact
              :to="'/patients'"
              name="patients"
              icon="person_search"
              label="Pacientes"
              v-if="menusVisible('Pacientes')"
            />
            <!--<q-route-tab
              exact
              :to="'/patients'"
              name="patients"
              icon="person_search"
              label="PacientDetails"
            />-->
            <q-route-tab
              exact
              :to="'/stock'"
              name="stock"
              icon="medication"
              label="Stock"
              v-if="menusVisible('Stock')"
            />
            <q-route-tab
              exact
              :to="'/reports'"
              name="reports"
              icon="list_alt"
              label="Relatórios"
              v-if="menusVisible('Relatorios')"
            />
            <q-route-tab
              exact
              :to="'/settings'"
              name="settings"
              icon="settings"
              label="Parâmetro"
              v-if="this.menusVisible('Parametro')"
            />
          </q-tabs>
          <q-btn-dropdown
            unelevated
            v-model="userInfoOpen"
            no-caps
            @click="onMainClick"
          >
            <template v-slot:label>
              <div class="row items-center no-wrap">
                <q-avatar size="lg" icon="account_circle"> </q-avatar>
                <div class="text-center q-pa-sm">
                  {{ username }}
                </div>
              </div>
            </template>
            <q-list style="width: 190px">
              <q-item>
                <q-item-section avatar>
                  <q-avatar icon="account_circle"> </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label lines="1">
                    <div class="">{{ username }}</div>
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-separator spaced />
              <q-item clickable v-close-popup @click="onItemClick" to="/Logout">
                <q-item-section avatar>
                  <q-avatar icon="mdi-logout" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Sair</q-item-label>
                  <q-item-label caption>Sair do Sistema</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </q-toolbar>
      </q-header>
    </div>
    <q-page-container>
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </q-page-container>

    <q-footer elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          <div class="row">
            <div class="col-4">
              <q-avatar size="30px">
                <img class="bg-white" src="../assets/LogoMonitoria.png" />
              </q-avatar>
            </div>
            <div
              style="font-family: 'Gill Sans'; font-size: 15px"
              class="col-3 text-center justify-center"
            >
              iDART - Monitoria de Dados de Pacientes Referidos @v1.3.0
            </div>
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue';
import menusAcessUtils from 'src/use/menusAcessUtils';
export default defineComponent({
  name: 'MainLayout',
  setup() {
    return {
      leftDrawerOpen: false,
      userInfoOpen: false,
      onMainClick: '',
      onItemClick: '',
      username: localStorage.getItem('user'),
      tab: ref('patients'),
    };
  },
  components: {},
  methods: {
    menusVisible(name) {
      return menusAcessUtils.menusVisible(name);
    },
  },
});
</script>
