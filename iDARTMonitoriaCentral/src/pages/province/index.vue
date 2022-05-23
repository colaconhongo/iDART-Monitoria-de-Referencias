<template>
  <q-page class="q-pa-sm q-gutter-sm">
    <q-table
      :columns="columns"
      :rows="allProvincias"
      :filter="filter"
      row-key="name"
      title="Província"
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
            label="Adicionar Novo"
            no-caps
            outline
            rounded
            @click="addNew()"
          />
          <q-btn
            color="primary"
            icon-right="archive"
            label="Imprimir em Excel"
            no-caps
            rounded
            @click="exportTable"
          />
        </div>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="code" :props="props">
            {{ props.row.code }}
          </q-td>
          <q-td key="description" :props="props">
            {{ props.row.description }}
          </q-td>
          <q-td key="pais" :props="props">
            <div class="text-pre-wrap">{{ props.row.uuid }}</div>
          </q-td>
          <q-td key="actions" :props="props">
            <div class="q-gutter-sm">
              <q-btn
                color="secondary"
                glossy
                icon="visibility"
                no-caps
                round
                size="sm"
              >
                <q-tooltip
                  class="bg-secondary"
                  content-class="text-primary shadow-4"
                  :offset="[10, 10]"
                  transition-show="rotate"
                  transition-hide="rotate"
                >
                  Ver Detalhes
                </q-tooltip>
              </q-btn>
              <q-btn
                color="warning"
                glossy
                icon="edit"
                no-caps
                round
                size="sm"
                @click="editaProvincia(props.row)"
              >
                <q-tooltip
                  class="bg-warning"
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
                glossy
                icon="delete_forever"
                no-caps
                round
                size="sm"
                @click="removeProvincia(props.row)"
              >
                <q-tooltip
                  class="bg-red"
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
    <CreateEditForm
      :is="show_dialog"
      v-model:createProvincia="createProvincia"
      v-model:show_dialog="show_dialog"
      v-model:close="close"
      v-model:listErrors="listErrors"
      v-model:options="options"
      v-model:provincia_details_dialog="provincia_details_dialog"
      v-model:paises="allPaises"
      v-model:province="province"
    />
  </q-page>
</template>

<script setup>
/*
  Imports
*/
import { exportFile, QSpinnerBall, useQuasar } from 'quasar';
import { ref, onMounted, computed, reactive } from 'vue';
import ProvinceService from '../../services/provinceService/provinceService';
import CreateEditForm from '../../components/province/createEditForm.vue';

/*
  Declarations
*/
const listErrors = ref([]);
const options = ref([]);
const provincia_details_dialog = ref(false);
const editedIndex = ref(-1);
const submitting = ref(false);
const filter = ref('');
const show_dialog = ref(false);
const show_filter = ref(false);
const $q = new useQuasar();
const province = ref([]);
const columns = [
  {
    name: 'code',
    required: true,
    label: 'Codigo',
    align: 'left',
    field: (row) => row.code,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'description',
    align: 'left',
    label: 'Designacao',
    field: (row) => row.description,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'pais',
    align: 'left',
    label: 'Pais',
    field: (row) => row.pais,
    format: (val) => `${val}`,
    sortable: true,
  },
  { name: 'actions', align: 'left', label: 'Ações', field: 'actions' },
];

/*
  Mounted Hooks
*/
onMounted(() => {
  $q.loading.show({
    message: 'Carregando ...',
    spinnerColor: 'grey-4',
    spinner: QSpinnerBall,
  });
  setTimeout(() => {
    $q.loading.hide();
  }, 600);
  ProvinceService.get(0);
});

/*
  Computed
*/
const allPaises = computed(() => {
  return [
    { codigo: '01', designacao: 'Mocambique' },
    { codigo: '02', designacao: 'Angola' },
    { codigo: '03', designacao: 'Portugal' },
  ];
});

const allProvincias = computed(() => {
  return ProvinceService.getAllFromStorage();
});

/*
  Methods
*/
const addNew = () => {
  show_dialog.value = true;
  province.value = reactive(ProvinceService.newInstanceEntity());
};
const createProvincia = () => {
  listErrors.value = [];
  submitting.value = true;
  if (editedIndex.value > -1) {
    ProvinceService.patch(province.value.id, province)
      .then(() => {
        submitting.value = false;
        $q.notify({
          type: 'positive',
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          timeout: 2000,
          position: 'bottom',
          classes: 'glossy',
          progress: true,
          message:
            'A informação foi actualizada com successo!! [ ' +
            province.value.description +
            ' ]',
        });
        close();
      })
      .catch((error) => {
        submitting.value = false;
        if (error.request != null) {
          const arrayErrors = JSON.parse(error.request.response);
          if (arrayErrors.total == null) {
            listErrors.value.push(arrayErrors.message);
          } else {
            arrayErrors._embedded.errors.forEach((element) => {
              listErrors.value.push(element.message);
            });
          }
          console.log(listErrors.value);
        }
      });
  } else {
    ProvinceService.post(province.value)
      .then(() => {
        submitting.value = false;
        $q.notify({
          type: 'positive',
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          timeout: 2000,
          position: 'bottom',
          classes: 'glossy',
          progress: true,
          message:
            'A informação foi inserida com successo! [ ' +
            province.value.description +
            ' ]',
        });
        close();
      })
      .catch((error) => {
        submitting.value = false;
        if (error.request != null) {
          const arrayErrors = JSON.parse(error.request.response);
          if (arrayErrors.total == null) {
            listErrors.value.push(arrayErrors.message);
          } else {
            arrayErrors._embedded.errors.forEach((element) => {
              listErrors.value.push(element.message);
            });
          }
          console.log(listErrors.value);
        }
      });
  }
};

const close = () => {
  show_dialog.value = false;
  listErrors.value = [];
  province.value = [];
  setTimeout(() => {
    editedIndex.value = -1;
  }, 300);
};

const removeProvincia = (provincia) => {
  $q.dialog({
    title: 'Confirmação',
    message: 'Tem certeza que pretende remover?',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    $q.notify({
      type: 'warning',
      color: 'primary',
      textColor: 'white',
      icon: 'cloud_done',
      timeout: 2000,
      position: 'bottom',
      classes: 'glossy',
      progress: true,
      message:
        'A informação foi Removida com successo! [ ' +
        provincia.designacao +
        ' ]',
    });
    ProvinceService.delete(provincia.id);
  });
};

const editaProvincia = (provincia) => {
  editedIndex.value = 0;
  province.value = Object.assign({}, provincia);
  show_dialog.value = true;
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
  const content = [this.columns.map((col) => wrapCsvValue(col.label))]
    .concat(
      allProvincias.value.map((row) =>
        columns
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

  const status = exportFile('provincia_list.csv', content, 'text/csv');
  if (status !== true) {
    $q.notify({
      message: 'O navegador recusou o download...',
      color: 'negative',
      icon: 'warning',
    });
  }
};
</script>
