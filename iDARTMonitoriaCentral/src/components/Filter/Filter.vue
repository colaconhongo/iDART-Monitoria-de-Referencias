<template>
  <div class="row">
    <SelectField
      :label="provinceLabel"
      class="col q-ml-md"
      disable
      v-model="province"
      :options="allProvincias"
      option-label="name"
      option-value="id"
    />
    <SelectField
      :label="districtLabel"
      class="col q-ml-md"
      v-model="district"
      :options="alldistrictsFromProvince"
      option-label="name"
      option-value="id"
    />
    <SelectField
      :label="facilityLabel"
      class="col q-ml-md"
      v-model="facility"
      :options="allFacilityFromDistrict"
      option-label="clinicname"
      option-value="id"
    />
    <SelectField
      :label="pharmacyLabel"
      class="col q-ml-md"
      v-model="pharmacy"
      :options="allPhamacyFromFacility"
      option-label="clinicname"
      option-value="id"
    />
  </div>
</template>

<script setup>
import { inject, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import SelectField from '../Shared/Input/SelectField.vue';

const { t } = useI18n();

const provinceLabel = ref(t('province'));
const districtLabel = ref(t('district'));
const facilityLabel = ref(t('facility'));
const pharmacyLabel = ref(t('pharmacy'));

/*
  Inject
*/
const province = inject('province');
const district = inject('district');
const facility = inject('facility');
const pharmacy = inject('pharmacy');

const allProvincias = inject('allProvincias');
const alldistrictsFromProvince = inject('alldistrictsFromProvince');
const allFacilityFromDistrict = inject('allFacilityFromDistrict');
const allPhamacyFromFacility = inject('allPhamacyFromFacility');

onMounted(() => {
  console.log(allProvincias);
  console.log(province);
  console.log(alldistrictsFromProvince);
  console.log('Filter district ', district);
});
</script>

<style></style>
