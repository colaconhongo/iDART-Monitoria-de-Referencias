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
          <div v-if="col.label === 'Estado'">
            <div class="sending_status" v-if="col.value === 'Enviado'">
              <span>
                <q-icon name="done_all" color="#ff9d0d" />
                <small style="font-size: small"> {{ col.value }} </small>
              </span>
            </div>
            <div class="pending_status" v-if="col.value === 'Pendente'">
              <span>
                <q-icon name="pending_actions" color="#fb1808" />
                <small style="font-size: small"> Pendente</small></span
              >
            </div>
          </div>

          <div v-else>
            <div v-if="col.value !== 'null'">
              {{ col.value }}
            </div>
            <div v-else>Não definido</div>
          </div>
        </q-td>
        <q-td v-if="with_actionsButton" auto-width>
          <div class="q-gutter-sm q-px-md">
            <q-btn
              color="orange"
              icon="edit"
              no-caps
              round
              size="sm"
              v-if="props.row.stopdate == null && props.row.syncstatus === 'P'"
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
<style scoped>
.pending_status {
  border-radius: 20px;
  background-color: #f5cbc8;
  color: #fb1808;
  text-align: center;
  width: 100%;
  margin-top: 5px;
  margin-bottom: 5px;
  padding: 8px;
}
.updating_status {
  border-radius: 20px;
  background-color: rgb(255 240 231);
  color: #ff9d0d;
  text-align: center;
  width: 100%;
  margin-top: 5px;
  margin-bottom: 5px;
  padding: 8px;
}
.sending_status {
  border-radius: 20px;
  background-color: rgb(216 255 242);
  color: #26bb0a;
  text-align: center;
  width: 100%;
  margin-top: 5px;
  margin-bottom: 5px;
  padding: 8px;
}
</style>
