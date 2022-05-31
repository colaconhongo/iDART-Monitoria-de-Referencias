<template>
  <q-page class="q-pa-sm q-gutter-sm q-mx-xl">
  <div>
     <stockList
      :columns="columns"
      :mode="mode"
      :with_downloadButton="false"
      :rows="stock"
      :title="props.title"
    />
  </div>
  </q-page>
</template>

<script setup>
  import { useQuasar, QSpinnerBall } from 'quasar';
  import { computed, onMounted, reactive, ref } from 'vue';
  import stockList from 'src/components/Shared/CRUD/TableList.vue';
  import stockService from 'src/services/stockService/stockService';
  import drugService from 'src/services/drugService/drugService';
  import stockCenterService from 'src/services/stockCenterService/stockCenter';
  import stockLevelService from 'src/services/stockLevelService/stockLevelService';


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
  const stockEventList = [];
  const stockItem = reactive({
    fnm: null,
    drug: null,
    balance: 0,
    clinic: null,
    state: null,
    drugId: null,
    clinicId: null
  });
  const columns = [
    { name: 'code', required: true, label: 'Código FNM', align: 'left', field: (row) => row.fnm, format: (val) => `${val}`, sortable: true },
    { name: 'drugName', align: 'left', label: 'Nome do Medicamento', field: (row) => row.drug, format: (val) => `${val}`, sortable: true },
    { name: 'balance', align: 'left', label: 'Saldo Actual', field: (row) => row.balance, format: (val) => `${val}`, sortable: true },
    { name: 'clinic', align: 'left', label: 'Farmácia de Referência', field: (row) => row.clinic, format: (val) => `${val}`, sortable: true },
    { name: 'state', align: 'left', label: 'Estado', field: (row) => row.state, format: (val) => `${val}`, sortable: true }
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
    if (allStock.value.length <= 0) {
      getAllDrugFromAPI(0);
      getAllStockFromAPI(0);
      getAllStockCenterFromAPI(0);
      getAllStockLevelFromAPI(0);
    }
  });

  /*
    Computed
  */
  const allStock = computed(() => {
    return stockService.getAllFromStorage();
  });

  const allDrugs = computed(() => {
    return drugService.getAllFromStorage();
  });

  /*
    Methods
  */
  const getAllDrugFromAPI = (offset) => {
    if (offset >= 0) {
      drugService.get(offset);
    }
  };

  const getAllStockFromAPI = (offset) => {
    if (offset >= 0) {
      stockService.get(offset);
    }
  };

  const getAllStockCenterFromAPI = (offset) => {
    if (offset >= 0) {
      stockCenterService.get(offset);
    }
  };

  const getAllStockLevelFromAPI = (offset) => {
    if (offset >= 0) {
      stockLevelService.get(offset);
    }
  };

  const generateStockList = () => {
    allDrugs.value.forEach(drug => {
      stockItem.drugId = drug.id
      const list = allStock.value.filter((item) => {
        return item.drug.id = drug.id

      })
      list.forEach((item) => {
        addToStockList(item, drug)
      })
    });
    return stockEventList
  };

  const stock = computed(() => {
    if (stockEventList.length <= 0) {
      generateStockList();
      return []
    }
    return stockEventList
  });

  const addToStockList = (stock, drug) => {
    if (stock.mainStock !== null) {
      let exists = false;
      let calBalance = 0;
      stock.stocklevels.forEach((level) => {
        calBalance += level.fullcontainersremaining;
      })
      if (stockEventList.length > 0) {
        exists = stockEventList.some((item) => {
          return item.drugId === drug.id && item.clinicId === stock.mainStock.clinicuuid
        })
        if (exists) {
          stockEventList.forEach((item) => {
            if (item.drugId === drug.id && item.clinicId === stock.mainStock.clinicuuid) {
              item.balance += calBalance;
            }
          })
        } else {
          const stockItem = reactive({
            fnm: drug.atccode_id,
            drug: drug.name,
            balance: calBalance,
            clinic: stock.mainStock.stockcentername,
            state: drug.active ? 'Activo' : 'Inactivo',
            drugId: drug.id,
            clinicId: stock.mainStock.clinicuuid,
          });
          stockEventList.push(stockItem)
        }
      } else {
        const stockItem = reactive({
          fnm: drug.atccode_id,
          drug: drug.name,
          balance: calBalance,
          clinic: stock.mainStock !== null ? stock.mainStock.stockcentername : '',
          state: drug.active ? 'Activo' : 'Inactivo',
          drugId: drug.id,
          clinicId: stock.mainStock.clinicuuid,
        });

        stockEventList.push(stockItem)
      }
    }
  };
</script>

<style>

</style>
