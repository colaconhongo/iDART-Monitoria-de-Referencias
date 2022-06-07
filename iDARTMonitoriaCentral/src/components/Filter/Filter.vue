<template>
  <div class="row q-pa-sm q-pt-sm">
    <SelectField
      :label="provinceLabel"
      class="col q-ml-md"
      disable
      v-model="province"
      :options="allProvincias"
      option-label="name"
      option-value="id"
      filled
    />
    <SelectField
      :label="districtLabel"
      class="col q-ml-md"
      v-model="district"
      :options="alldistrictsFromProvince"
      option-label="name"
      option-value="id"
      filled
    />
    <SelectField
      :label="facilityLabel"
      class="col q-ml-md"
      v-model="facility"
      :disable="isDashboard"
      :options="allFacilityFromDistrict"
      option-label="clinicname"
      option-value="id"
      filled
    />
    <SelectField
      :label="pharmacyLabel"
      class="col q-ml-md"
      v-model="pharmacy"
      :options="allPhamacyFromFacility"
      option-label="clinicname"
      option-value="id"
      filled
    />
    <div v-if="isDashboard"  class="col q-ml-md">
    <SelectField
      :label="yearLabel"
      v-model="year"
      :options="yearsToShow"
      option-label="name"
      option-value="name"
      filled
    />
    </div>
  </div>
</template>

<script setup>
import { inject, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { LocalStorage } from 'quasar'
import SelectField from '../Shared/Input/SelectField.vue';
import DistrictService from 'src/services/districtService/districtService';

const { t } = useI18n();

const provinceLabel = ref(t('province'));
const districtLabel = ref(t('district'));
const facilityLabel = ref(t('facility'));
const pharmacyLabel = ref(t('pharmacy'));
const yearLabel =  ref(t('year'));


const props = defineProps(['isDashboard']);

/*
  Inject
*/
const province = inject('province');
let district = inject('district');
const facility = inject('facility');
const pharmacy = inject('pharmacy');
const year = inject('year');
const yearsToShow = inject('yearsToShow');

const allProvincias = inject('allProvincias');
const alldistrictsFromProvince = inject('alldistrictsFromProvince');
const allFacilityFromDistrict = inject('allFacilityFromDistrict');
const allPhamacyFromFacility = inject('allPhamacyFromFacility');


onMounted(() => {
  console.log(allProvincias);
  console.log(province);
  console.log(alldistrictsFromProvince);
  // console.log('Filter district ', district);
   // console.log(LocalStorage.getItem('district'))
    //  district = DistrictService.getDistrictFromStorage(LocalStorage.getItem('district').id)
// console.log(district)
 
});
</script>

<style></style>
