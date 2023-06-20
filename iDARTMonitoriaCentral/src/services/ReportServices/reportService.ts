import moment from 'moment';
import api from 'src/services/apiService/apiService';
import { useRepo } from 'pinia-orm';
import Dispense from 'src/stores/models/dispense/dispense';
import useUtils from 'src/use/useUtils';

const sync_temp_dispense = useRepo(Dispense);

export default {
  // Axios API call
  getReferedPatientsReport(params) {
    const url = `refered_patients_vw?referaldate=gte.${useUtils.getDateFormatYYYYMMDDFromDDMMYYYY(
      params.value.startDate
    )}&referaldate=lte.${useUtils.getDateFormatYYYYMMDDFromDDMMYYYY(
      params.value.endDate
    )}${this.buildGenericCondition(params)}`;
    return api()
      .get(url)
      .then((resp) => {
        return resp.data;
      });
  },
  getReferedPatientsClinicSectorReport(params) {
    const url = `refered_patients_clinic_sector_vw?referaldate=gte.${useUtils.getDateFormatYYYYMMDDFromDDMMYYYY(
      params.value.startDate
    )}&referaldate=lte.${useUtils.getDateFormatYYYYMMDDFromDDMMYYYY(
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
        `returned_refered_patients_vw?returndate=gte.${useUtils.getDateFormatYYYYMMDDFromDDMMYYYY(
          params.value.startDate
        )}&returndate=lte.${useUtils.getDateFormatYYYYMMDDFromDDMMYYYY(
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
        `refered_patients_dispense_history_vw?pickupdate=gte.${useUtils.getDateFormatYYYYMMDDFromDDMMYYYY(
          params.value.startDate
        )}&pickupdate=lte.${useUtils.getDateFormatYYYYMMDDFromDDMMYYYY(
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
        `rpc/get_dispenses_by_drugandregimen_onperiod?startdate=${useUtils.getDateFormatYYYYMMDDFromDDMMYYYY(
          params.value.startDate
        )}&enddate=${useUtils.getDateFormatYYYYMMDDFromDDMMYYYY(
          params.value.endDate
        )}${this.buildGenericFuncCondition(params)}`
      )
      .then((resp) => {
        return resp.data;
      });
  },
  getPatientsWithMissDispenses(params) {
    const url = `rpc/getfaltosos?datafim=${useUtils.getDateFormatYYYYMMDDFromDDMMYYYY(
      params.value.endDate
    )}${this.buildGenericCondition(params)}`;
    return api()
      .get(url)
      .then((resp) => {
        return resp.data;
      });
  },
  getActivePatients(params) {
    const url = `rpc/get_active_patients?datafim=${useUtils.getDateFormatYYYYMMDDFromDDMMYYYY(
      params.value.endDate
    )}${this.buildGenericCondition(params)}`;
    return api()
      .get(url)
      .then((resp) => {
        return resp.data;
      });
  },
  getInactivePatientsInDD(params) {
    const url = `rpc/get_inactive_patients_in_ddm?datainicio=${useUtils.getDateFormatYYYYMMDDFromDDMMYYYY(
      params.value.startDate
    )}&datafim=${useUtils.getDateFormatYYYYMMDDFromDDMMYYYY(
      params.value.endDate
    )}${this.buildGenericFuncCondition(params)}`;
    return api()
      .get(url)
      .then((resp) => {
        return resp.data;
      });
  },
  getActivePatientsInDDM(params) {
    const url = `rpc/get_active_patients_in_ddm?datafim=${useUtils.getDateFormatYYYYMMDDFromDDMMYYYY(
      params.value.endDate
    )}&datainicio=${useUtils.getDateFormatYYYYMMDDFromDDMMYYYY(
      params.value.startDate
    )}${this.buildGenericFuncCondition(params)}`;
    return api()
      .get(url)
      .then((resp) => {
        return resp.data;
      });
  },
  getEnrolledPatientsInDDM(params) {
    const url = `rpc/get_enrolled_patients_in_mdd?datafim=${useUtils.getDateFormatYYYYMMDDFromDDMMYYYY(
      params.value.endDate
    )}&datainicio=${useUtils.getDateFormatYYYYMMDDFromDDMMYYYY(
      params.value.startDate
    )}${this.buildGenericFuncCondition(params)}`;
    return api()
      .get(url)
      .then((resp) => {
        return resp.data;
      });
  },
  getNotSyncDispenses(params) {
    return api()
      .get(
        `refered_patients_dispense_history_vw?pickupdate=gte.${useUtils.getDateFormatYYYYMMDDFromDDMMYYYY(
          params.value.startDate
        )}&pickupdate=lte.${useUtils.getDateFormatYYYYMMDDFromDDMMYYYY(
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
        `patients_with_clinic_info_vw?lastscreeningdate=gte.${useUtils.getDateFormatYYYYMMDDFromDDMMYYYY(
          params.value.startDate
        )}&lastscreeningdate=lte.${useUtils.getDateFormatYYYYMMDDFromDDMMYYYY(
          params.value.endDate
        )}${this.buildGenericCondition(params)}`
      )
      .then((resp) => {
        return resp.data;
      });
  },
  getPrescriptionsByPatientId(patientid: string) {
    const list = api()
      .get('sync_temp_dispense?patientid=eq.' + patientid)
      .then((resp) => {
        return resp.data;
      });
    return list;
  },
  getFormatDDMMYYYY(date: string) {
    return useUtils.getDateFormatDDMMYYYY(date); //moment(date).format('DD-MM-YYYY');
  },
  getFormatYYYYMMDD(date: string) {
    return useUtils.getDateFormatYYYYMMDD(date); //moment(date,'DD-MM-YYYY').format('YYYY-MM-DD');
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
    if (
      params.value !== undefined &&
      params.value.facility !== undefined &&
      params.value.facility !== null &&
      params.value.facility.id !== undefined
    ) {
      conditionString =
        conditionString +
        '&mainclinicuuid=eq.' +
        params.value.facility.mainclinicuuid;
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
    if (
      params.value !== undefined &&
      params.value.facility !== undefined &&
      params.value.facility !== null &&
      params.value.facility.id !== undefined
    ) {
      conditionString =
        conditionString +
        '&mainclinicuuid=eq.' +
        params.value.facility.mainclinicuuid;
    }
    return conditionString;
  },
};
