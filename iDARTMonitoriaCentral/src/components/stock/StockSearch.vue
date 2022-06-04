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
        :rows="stockReport"
        :visualizar="viewStock"
        title="Stock da Província"
      />
    </div>
  </q-page>
</template>

<script setup>
  import { computed, onMounted, reactive, ref, inject } from 'vue';
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
  const columns = [
    { name: 'code', required: true, label: 'Código FNM', align: 'left', field: (row) => row.fnm, format: (val) => `${val}`, sortable: true },
    { name: 'drugName', align: 'left', label: 'Nome do Medicamento', field: (row) => row.drugname, format: (val) => `${val}`, sortable: true },
    { name: 'balance', align: 'left', label: 'Saldo Actual', field: (row) => row.balance, format: (val) => `${val}`, sortable: true },
    { name: 'clinic', align: 'left', label: 'Farmácia de Referência', field: (row) => row.clinicname, format: (val) => `${val}`, sortable: true },
    { name: 'state', align: 'left', label: 'Estado', field: (row) => row.estado, format: (val) => `${val}`, sortable: true }
  ];
  /*
    Mounted Hooks
  */
  onMounted(() => {
    if (stockReport.value.length <= 0) {
      getStockReportFromAPI(0)
    }
  });

  /*
    Computed
  */

  const stockReport = computed(() => {
    const list = stockReportService.getAllFromStorage();
    if (list.length <= 0) return []
    return list
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

<style>

</style>
