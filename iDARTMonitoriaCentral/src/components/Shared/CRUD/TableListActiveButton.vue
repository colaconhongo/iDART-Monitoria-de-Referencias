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
          {{ col.value }}
        </q-td>
        <q-td v-if="with_actionsButton" auto-width>
          <div class="q-gutter-sm q-px-md">
            <q-btn
              flat
              round
              class="q-ml-md"
              size="md"
              :color="getColorActive(props.row)"
              :icon="getIconActive(props.row)"
              @click.stop="promptToConfirm(props.row)"
            >
              <q-tooltip :class="getTooltipClass(props.row)">{{
                props.row.active || props.row.role === 'authenticator'
                  ? 'Inactivar'
                  : 'Activar'
              }}</q-tooltip>
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
                content-class="bg-white text-primary shadow-4"
                :offset="[10, 10]"
                transition-show="rotate"
                transition-hide="rotate"
              >
                Remover
              </q-tooltip>
            </q-btn>
            <q-btn
              color="orange"
              icon="edit"
              no-caps
              round
              size="sm"
              v-if="with_actionEditButton || props.row.role === 'authenticator'"
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
              color="primary"
              icon-right="east"
              align="left"
              no-caps
              label="Ver"
              unelevated
              rounded
              size="sm"
              v-if="
                with_actionDetailButton || props.row.role === 'authenticator'
              "
              @click="visualizar(props.row)"
            >
              <q-tooltip
                content-class="bg-red text-white shadow-4"
                :offset="[10, 10]"
                transition-show="rotate"
                transition-hide="rotate"
              >
                Ver detalhes
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
  promptToConfirm: {
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
const getIconActive = (entity) => {
  if (entity.active || entity.role === 'authenticator') {
    return 'stop_circle';
  } else if (!entity.active) {
    return 'play_circle';
  }
};
const getColorActive = (entity) => {
  if (entity.active || entity.role === 'authenticator') {
    return 'red';
  } else if (!entity.active) {
    return 'green';
  }
};
const getTooltipClass = (entity) => {
  if (entity.active || entity.role === 'authenticator') {
    return 'bg-red-5';
  } else if (!entity.active) {
    return 'bg-green-5';
  }
};
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
