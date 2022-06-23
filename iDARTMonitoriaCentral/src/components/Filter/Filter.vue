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
      dense
    />
    <SelectField
      :label="districtLabel"
      class="col q-ml-md"
      v-model="district"
      :options="alldistrictsFromProvince"
      option-label="name"
      option-value="id"
      filled
      dense
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
      dense
      @clear="clearPharmacy()"
    />
    <div v-if="props.isDashboard" class="col q-ml-md">
      <SelectField
        :label="yearLabel"
        v-model="year"
        :options="yearsToShow"
        option-label="name"
        option-value="name"
        filled
        dense
      />
    </div>
  </div>
</template>

<script setup>
import { inject, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { SessionStorage } from 'quasar';
import SelectField from '../Shared/Input/SelectField.vue';

const { t } = useI18n();
const provinceLabel = ref(t('province'));
const districtLabel = ref(t('district'));
const pharmacyLabel = ref('Farmácia');
const yearLabel = ref(t('year'));

const props = defineProps(['isDashboard']);

/*
  Inject
*/
const province = inject('province');
const district = inject('district');
const pharmacy = inject('pharmacy');
const year = inject('year');
const yearsToShow = inject('yearsToShow');

const allProvincias = inject('allProvincias');
const alldistrictsFromProvince = inject('alldistrictsFromProvince');
const allPhamacyFromFacility = inject('allPhamacyFromFacility');

const clearDistrict = () => {
  SessionStorage.remove('district');
  // district.value = null;
};

const clearPharmacy = () => {
  SessionStorage.remove('pharmacy');
  // pharmacy.value = null;
};
</script>

<style></style>
