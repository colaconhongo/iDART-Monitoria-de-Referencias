import moment from 'moment';
import api from 'src/services/apiService/apiService';

export default {
  // Axios API call
  getReferedPatientsReport(params) {
    const url = `refered_patients_vw?referaldate=gte.${this.getFormatYYYYMMDD(
      params.value.startDate
    )}&referaldate=lte.${this.getFormatYYYYMMDD(
      params.value.endDate
    )}${this.buildGenericCondition(params)}`;
    return api()
      .get(url)
      .then((resp) => {
        return resp.data;
      });
  },
  getReturnedReferedPatient(params) {
    return api()
      .get(
        `returned_refered_patients_vw?returndate=gte.${this.getFormatYYYYMMDD(
          params.value.startDate
        )}&returndate=lte.${this.getFormatYYYYMMDD(
          params.value.endDate
        )}${this.buildGenericCondition(params)}`
      )
      .then((resp) => {
        return resp.data;
      });
  },
  getPatientDispenseHistory(params) {
    return api()
      .get(
        `refered_patients_dispense_history_vw?pickupdate=gte.${this.getFormatYYYYMMDD(
          params.value.startDate
        )}&pickupdate=lte.${this.getFormatYYYYMMDD(
          params.value.endDate
        )}${this.buildGenericCondition(params)}`
      )
      .then((resp) => {
        return resp.data;
      });
  },
  getDispensesByDrugAndRegimen(params) {
    return api()
      .get(
        `rpc/get_dispenses_by_drugandregimen_onperiod?startdate=${this.getFormatYYYYMMDD(
          params.value.startDate
        )}&enddate=${this.getFormatYYYYMMDD(
          params.value.endDate
        )}${this.buildGenericFuncCondition(params)}`
      )
      .then((resp) => {
        return resp.data;
      });
  },
  getPatientsWithMissDispenses(params) {
    const url = `rpc/getfaltosos?enddate=${this.getFormatYYYYMMDD(
      params.value.endDate
    )}${this.buildGenericCondition(params)}`;
    return api()
      .get(url)
      .then((resp) => {
        return resp.data;
      });
  },
  getActivePatients(params) {
    const url = `rpc/get_active_patients?enddate=${this.getFormatYYYYMMDD(
      params.value.endDate
    )}${this.buildGenericCondition(params)}`;
    return api()
      .get(url)
      .then((resp) => {
        return resp.data;
      });
  },
  getNotSyncDispenses(params) {
    return api()
      .get(
        `refered_patients_dispense_history_vw?pickupdate=gte.${this.getFormatYYYYMMDD(
          params.value.startDate
        )}&pickupdate=lte.${this.getFormatYYYYMMDD(
          params.value.endDate
        )}&syncstatus=eq.P${this.buildGenericCondition(params)}`
      )
      .then((resp) => {
        return resp.data;
      });
  },
  getPatientWithClinicInfo(params) {
    return api()
      .get(
        `patients_with_clinic_info_vw?lastscreeningdate=gte.${this.getFormatYYYYMMDD(
          params.value.startDate
        )}&lastscreeningdate=lte.${this.getFormatYYYYMMDD(
          params.value.endDate
        )}${this.buildGenericCondition(params)}`
      )
      .then((resp) => {
        return resp.data;
      });
  },
  getFormatDDMMYYYY(date) {
    return moment(date).format('DD-MM-YYYY');
  },
  getFormatYYYYMMDD(date) {
    return moment(date,'DD-MM-YYYY').format('YYYY-MM-DD');
  },
  buildGenericCondition(params) {
    let conditionString = '';
    if (
      params.value !== undefined &&
      params.value.district !== undefined &&
      params.value.district !== null &&
      params.value.district.id !== undefined &&
      params.value.district.id > 0
    ) {
      conditionString =
        conditionString + '&district=eq.' + params.value.district.name;
    }

    if (
      params.value !== undefined &&
      params.value.clinic !== undefined &&
      params.value.clinic !== null &&
      params.value.clinic.id !== undefined
    ) {
      conditionString =
        conditionString + '&clinicuuid=eq.' + params.value.clinic.uuid;
    }
    return conditionString;
  },
  buildGenericFuncCondition(params) {
    let conditionString = '';
    if (
      params.value !== undefined &&
      params.value.district !== undefined &&
      params.value.district !== null &&
      params.value.district.id !== undefined &&
      params.value.district.id > 0
    ) {
      conditionString =
        conditionString + '&district=' + params.value.district.name;
    }

    if (
      params.value !== undefined &&
      params.value.clinic !== undefined &&
      params.value.clinic !== null &&
      params.value.clinic.id !== undefined
    ) {
      conditionString =
        conditionString + '&clinicuuid=' + params.value.clinic.uuid;
    }
    return conditionString;
  },
};
