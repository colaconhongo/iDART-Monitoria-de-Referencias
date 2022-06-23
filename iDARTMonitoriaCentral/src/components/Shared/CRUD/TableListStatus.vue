<template>
  <q-table
    :columns="columns"
    :rows="rows"
    :filter="filter"
    :grid="mode == 'grid'"
    row-key="name"
    :title="title"
  >
    <template v-slot:top-right>
      <q-input
        v-if="show_filter"
        v-model="filter"
        borderless
        debounce="300"
        dense
        filled
        placeholder="Pesquisa"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>

      <div class="q-pa-md q-gutter-sm">
        <q-btn
          class="q-ml-sm"
          flat
          icon="filter_list"
          @click="show_filter = !show_filter"
        />
        <q-btn
          flat
          round
          dense
          :icon="mode === 'grid' ? 'list' : 'grid_on'"
          @click="
            mode = mode === 'grid' ? 'list' : 'grid';
            separator = mode === 'grid' ? 'none' : 'horizontal';
          "
          v-if="!props.inFullscreen"
        >
          <q-tooltip :disable="$q.platform.is.mobile" v-close-popup
            >{{ mode === 'grid' ? 'List' : 'Grid' }}
          </q-tooltip>
        </q-btn>
        <q-btn
          color="primary"
          icon-right="archive"
          label="Imprimir em Excel"
          no-caps
          rounded
          v-if="with_downloadButton"
          @click="exportTable"
        />
      </div>
    </template>
    <template v-slot:header="props">
      <q-tr :props="props">
        <q-th v-for="col in props.cols" :key="col.name" :props="props">
          {{ col.label }}
        </q-th>
        <q-th v-if="with_actionsButton" auto-width />
      </q-tr>
    </template>
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td v-for="col in props.cols" :key="col.name" :props="props">
          <div v-if="col.value === 'I' && col.name === 'syncstatus'">
            <label style="color: green">
              <q-icon name="cloud_upload" size="md"></q-icon>
              <q-tooltip>Actualizado</q-tooltip>
            </label>
            <!--Enviado-->
          </div>
          <div v-else-if="col.value === 'L' && col.name === 'syncstatus'">
            <label style="color: orange">
              <q-icon name="cloud_download" size="md"></q-icon>
              <q-tooltip>Actualizado</q-tooltip>
              <!--Actualizado--></label
            >
          </div>
          <div v-else-if="col.value === 'P' && col.name === 'syncstatus'">
            <label style="color: orange"
              ><q-icon name="warning" size="md"></q-icon>
              <q-tooltip>Pendente</q-tooltip>
              <!--Pendente-->
            </label>
          </div>
          <div v-else>
            {{ col.value }}
          </div>
        </q-td>
        <q-td v-if="with_actionsButton" auto-width>
          <div class="q-gutter-sm">
            <q-btn
              color="secondary"
              icon="visibility"
              no-caps
              round
              size="sm"
              v-if="with_actionDetailButton"
              @click="visualizar(props.row)"
            >
              <q-tooltip
                content-class="bg-white text-primary shadow-4"
                :offset="[10, 10]"
                transition-show="rotate"
                transition-hide="rotate"
              >
                Ver Detalhes
              </q-tooltip>
            </q-btn>
            <q-btn
              color="orange"
              icon="edit"
              no-caps
              round
              size="sm"
              v-if="with_actionEditButton"
              @click="editar(props.row)"
            >
              <q-tooltip
                content-class="bg-white text-primary shadow-4"
                :offset="[10, 10]"
                transition-show="rotate"
                transition-hide="rotate"
              >
                Editar
              </q-tooltip>
            </q-btn>
            <q-btn
              color="red"
              icon="delete_forever"
              no-caps
              round
              size="sm"
              v-if="with_actionRemoveButton"
              @click="remover(props.row)"
            >
              <q-tooltip
                content-class="bg-red text-white shadow-4"
                :offset="[10, 10]"
                transition-show="rotate"
                transition-hide="rotate"
              >
                Remover
              </q-tooltip>
            </q-btn>
          </div>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script setup>
/*
  Imports
*/
import { exportFile, useQuasar } from 'quasar';
import { reactive, ref } from 'vue';

/*
  Declarations
*/
const filter = ref('');
const show_filter = ref(false);
const $q = new useQuasar();
const colunas = reactive(props.columns);
const linhas = reactive(props.rows);

/*
  Props
  */
const props = defineProps({
  title: {
    type: String,
    default: 'Sem Titúlo',
  },
  mode: {
    type: String,
    default: 'list',
  },
  with_downloadButton: {
    type: Boolean,
  },
  with_actionsButton: {
    type: Boolean,
    default: true,
  },
  with_actionDetailButton: {
    type: Boolean,
    default: true,
  },
  with_actionRemoveButton: {
    type: Boolean,
    default: true,
  },
  with_actionEditButton: {
    type: Boolean,
    default: true,
  },
  columns: {
    type: Array,
    default: ref([]),
  },
  rows: {
    type: Array,
    default: ref([]),
  },
  visualizar: {
    type: Function,
  },
  editar: {
    type: Function,
  },
  remover: {
    type: Function,
  },
});

/*
  Mounted Hooks
*/

/*
  Computed
*/

/*
  Methods
*/

const wrapCsvValue = (val, formatFn) => {
  let formatted = formatFn !== undefined ? formatFn(val) : val;
  formatted =
    formatted === undefined || formatted === null ? '' : String(formatted);
  formatted = formatted.split('"').join('""');
  return `"${formatted}"`;
};

const exportTable = () => {
  // naive encoding to csv format
  const content = [colunas.map((col) => wrapCsvValue(col.label))]
    .concat(
      linhas.map((row) =>
        colunas
          .map((col) =>
            wrapCsvValue(
              typeof col.field === 'function'
                ? col.field(row)
                : row[col.field === undefined ? col.name : col.field],
              col.format
            )
          )
          .join(',')
      )
    )
    .join('\r\n');

  const blob = new Blob(['\uFEFF' + content], {
    type: 'text/csv; charset=utf-18',
  });

  const status = exportFile(props.title.concat('.csv'), blob);
  if (status !== true) {
    $q.notify({
      message: 'O navegador recusou o download...',
      color: 'negative',
      icon: 'warning',
    });
  }
};
</script>
