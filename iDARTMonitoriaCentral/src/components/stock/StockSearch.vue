<template>
  <q-page class="q-pa-sm q-gutter-sm">
    <stockList
      :columns="columns"
      :mode="mode"
      :with_downloadButton="true"
      :rows="allStock"
      :title="props.title"
    />
  </q-page>
</template>

<script setup>
  import { useQuasar } from 'quasar';
  import { computed, reactive, ref } from 'vue';
  import stockList from 'src/components/Shared/CRUD/TableList.vue';
  import stockService from 'src/services/stockService/stockService';
  // import drugService from 'src/services/drugService/drugService';


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
  const $q = new useQuasar();
  const mode = reactive(ref('list'));
  const columns = [
    { name: 'code', required: true, label: 'Código FNM', align: 'left', field: (row) => row.drug.atccode_id, format: (val) => `${val}`, sortable: true },
    { name: 'drugName', align: 'left', label: 'Nome do Medicamento', field: (row) => row.drug.name, format: (val) => `${val}`, sortable: true },
    { name: 'balance', align: 'left', label: 'Saldo Actual', field: (row) => row.balance, format: (val) => `${val}`, sortable: true },
    { name: 'clinic', align: 'left', label: 'Farmácia de Referência', field: (row) => row.mainStock, format: (val) => `${val}`, sortable: true },
    { name: 'state', align: 'left', label: 'Estado', field: (row) => row.drug.active, format: (val) => `${val}`, sortable: true }
  ];


  /*
    Computed
  */
  const allStock = computed(() => {
    return stockService.getAllFromStorage();
  });


</script>

<style>

</style>
