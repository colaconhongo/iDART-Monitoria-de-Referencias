<template>
  <q-page class="q-pa-sm q-gutter-sm q-mx-xl">
    <div>
      <stockList
        :columns="columns"
        :mode="mode"
        :with_downloadButton="false"
        :with_actionDetailButton="true"
        :with_actionEditButton="false"
        :with_actionRemoveButton="false"
        :rows="fullStockList"
        :visualizar="viewStock"
        title="Stock da Província"
      />
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted, reactive, ref, inject, watch } from 'vue';
import stockList from 'src/components/Shared/CRUD/TableList.vue';
import stockReportService from 'src/services/ReportServices/stock/stockReportService';

/*
  Props
  */
const props = defineProps({
  title: {
    type: String,
  },
});

/*
  Declarations
  */
const mode = reactive(ref('list'));
const viewStock = inject('viewStock');
let district = inject('district');
let pharmacy = inject('pharmacy');
let stockReportList = reactive(ref([]));

const columns = [
  {
    name: 'code',
    required: true,
    label: 'Código FNM',
    align: 'left',
    field: (row) => row.fnm,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'drugName',
    align: 'left',
    label: 'Nome do Medicamento',
    field: (row) => row.drugname,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'balance',
    align: 'left',
    label: 'Saldo Actual',
    field: (row) => row.balance,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'clinic',
    align: 'left',
    label: 'Farmácia de Referência',
    field: (row) => row.clinicname,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'state',
    align: 'left',
    label: 'Estado',
    field: (row) => row.estado,
    format: (val) => `${val}`,
    sortable: true,
  },
];
/*
    Mounted Hooks
  */
onMounted(() => {
  getStockReportFromAPI(0);
  loadAllStock();
});

const loadAllStock = () => {
  stockReportList.value = stockReportService.getAllFromStorage();

  return stockReportList.value;
};

/*
  Computed
*/
const fullStockList = computed(() => {
  if (district.value != null && district.value.id > 0) {
    return stockReportList.value;
  } else {
    return loadAllStock();
  }
});

/*
Watchers
*/
watch(district, () => {
  // pharmacy.value = null
  reloadByDistrict();
});

const reloadByDistrict = () => {
  const list = stockReportService.getAllFromStorage();
  if (district.value != null) {
    if (list.length <= 0) stockReportList.value = [];

    stockReportList.value = list.filter((item) => {
      return item.district === district.value.name;
    });
  } else {
    stockReportList.value = fullStockList.value;
  }
};

const reloadByClinic = () => {
  if (pharmacy.value != null && stockReportList.value.length > 0) {
    reloadByDistrict();
    const bkp = stockReportList.value;
    stockReportList.value = [];
    stockReportList.value = bkp.filter((item) => {
      return item.clinicname === pharmacy.value.clinicname;
    });
  }
};

watch(pharmacy, () => {
  reloadByClinic();
});

/*
    Methods
  */
const getStockReportFromAPI = (offset) => {
  if (offset >= 0) {
    stockReportService.get(offset);
  }
};
</script>

<style></style>
