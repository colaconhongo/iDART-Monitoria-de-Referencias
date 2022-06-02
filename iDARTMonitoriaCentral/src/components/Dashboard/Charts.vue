<template>
<div>
<div class="q-mt-lg">
<div class="row">
<div class="col q-ml-md">
   <q-select
                        label="Província"
                        tack-label
                        class="col"
                        v-model="provincia"
                        use-input
                        fill-input
                        hide-selected
                        :options="allProvincias"
                        option-label="name"
                        option-value="id"
                        filled
                      />
    </div>
</div>
</div>
</div>
</template>
<script setup>
import ProvinceService from 'src/services/provinceService/provinceService';
import { computed } from 'vue';


/*
  Computed
*/
const allProvincias = computed(() => {
  return ProvinceService.getAllFromStorage();
});
</script>