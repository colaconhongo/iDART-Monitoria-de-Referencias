<template>
  <div class="row q-pa-ml q-pt-md">
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
      clearable
      @clear="clearDistrict()"
    />
    <SelectField
      :label="pharmacyLabel"
      class="col q-ml-md"
      v-model="pharmacy"
      :options="allPhamacyFromFacility"
      option-label="clinicname"
      option-value="id"
      filled
      clearable
      @clear="clearPharmacy()"
    />
    <div v-if="isDashboard" class="col q-ml-md">
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
import { inject, onMounted, ref, onActivated, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { LocalStorage, SessionStorage } from 'quasar';
import SelectField from '../Shared/Input/SelectField.vue';
import DistrictService from 'src/services/districtService/districtService';
import clinicService from 'src/services/clinicService/clinicService';

const { t } = useI18n();

const provinceLabel = ref(t('province'));
const districtLabel = ref(t('district'));
const facilityLabel = ref(t('facility'));
const pharmacyLabel = ref(t('pharmacy'));
const yearLabel = ref(t('year'));

const props = defineProps(['isDashboard']);

/*
  Inject
*/
const province = inject('province');
const district = inject('district');
const facility = inject('facility');
const pharmacy = inject('pharmacy');
const year = inject('year');
const yearsToShow = inject('yearsToShow');

const allProvincias = inject('allProvincias');
const alldistrictsFromProvince = inject('alldistrictsFromProvince');
const allPhamacyFromFacility = inject('allPhamacyFromFacility');

onMounted(() => {
  console.log(allProvincias);
  console.log(province);
  console.log(alldistrictsFromProvince);
});

/*
const allFacilityFromDistrict = computed(() => {
   if(district.value !== undefined) {
  return clinicService.getAllUSFromDistrict(district.value.name);
   }
});

const allPhamacyFromFacility = computed(() => {
   if(district.value !== undefined) {
  return clinicService.getAllPharmacyFromDistrict(district.value.name);
   }
});

onActivated(() => {
    if (SessionStorage.getItem('district') !== null) {
    district.value = SessionStorage.getItem('district')
  }
  console.log(district)
});
*/

const clearDistrict = () => {
  SessionStorage.remove('district');
};

const clearPharmacy = () => {
  SessionStorage.remove('pharmacy');
};
</script>

<style></style>
