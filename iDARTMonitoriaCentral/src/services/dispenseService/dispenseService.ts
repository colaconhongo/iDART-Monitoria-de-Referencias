import { useRepo } from 'pinia-orm';
import Dispense from 'src/stores/models/dispense/dispense';
import patientService from 'src/services/patientService/patientService';
import api from '../apiService/apiService';
import moment from 'moment';
import District from 'src/stores/models/district/district';
import Clinic from 'src/stores/models/clinic/clinic';
import useUtils from 'src/use/useUtils';
import { Loading, QSpinnerBall } from 'quasar';

const sync_temp_dispense = useRepo(Dispense);

export default {
  // Axios API call
  post(params: string) {
    return api()
      .post('sync_temp_dispense', params)
      .then((resp) => {
        sync_temp_dispense.save(resp.data);
      });
  },
  get(offset: number) {
    Loading.show({
      message: 'Carregando ...',
      spinnerColor: 'grey-4',
      spinner: QSpinnerBall,
    });
    if (offset >= 0) {
      return api()
        .get('sync_temp_dispense?offset=' + offset + '&limit=100')
        .then((resp) => {
          sync_temp_dispense.save(resp.data);
          offset = offset + 100;
          if (resp.data.length > 0) {
            this.get(offset);
          } else {
            Loading.hide();
          }
        })
        .catch(() => {
          Loading.hide();
        });
    }
  },
  patch(id: number, params: string) {
    return api()
      .patch('sync_temp_dispense/' + id, params)
      .then((resp) => {
        sync_temp_dispense.save(resp.data);
      });
  },
  delete(id: number) {
    return api()
      .delete('sync_temp_dispense/' + id)
      .then(() => {
        sync_temp_dispense.destroy(id);
      });
  },
  // Local Storage Pinia
  newInstanceEntity() {
    return sync_temp_dispense.getModel().$newInstance();
  },
  getAllFromStorage() {
    return sync_temp_dispense.all();
  },
  getAllDispenseQuarterly() {
    return sync_temp_dispense
      .query()
      .where((dispense) => {
        return dispense.dispensatrimestral === 1;
      })
      .get();
  },
  getAllDispenseSemestre() {
    return sync_temp_dispense
      .query()
      .where((dispense) => {
        return dispense.dispensasemestral === 1;
      })
      .get();
  },
  getAllDispenseMensal() {
    return sync_temp_dispense
      .query()
      .where((dispense) => {
        return (
          dispense.dispensasemestral === 0 && dispense.dispensatrimestral === 0
        );
      })
      .get();
  },

  getDispensesByRegimeByYear(year: number) {
    Loading.show({
      message: 'Carregando ...',
      spinnerColor: 'grey-4',
      spinner: QSpinnerBall,
    });
    const yearBefore = year - 1;
    const startDate = useUtils.getDateFormatMMDDYYYY('12-21-' + yearBefore);
    const endDate = useUtils.getDateFormatMMDDYYYY('12-20-' + year);

    return api()
      .get(
        'sync_temp_dispense?dispensedate=gte.' +
          startDate +
          '&dispensedate=lte.' +
          endDate
      )
      .then((resp) => {
        sync_temp_dispense.save(resp.data);
        Loading.hide();
      })
      .catch(() => {
        Loading.hide();
      });
  },

  getDispensesByYearAndDistrictAndClinicAndPharmacyFromLocalStorage(
    year: number,
    district: District,
    pharmacy: Clinic
  ) {
    const yearBefore = year - 1;
    const startDate = new Date('12-21-' + yearBefore);
    const endDate = new Date('12-20-' + year);

    let patients =
      patientService.getPatientsByYearAndDistrictAndClinicAndPharmacyFromLocalStorage(
        year,
        district,
        pharmacy
      );
    patients = patients.map((patient) => patient.uuidopenmrs);
    const dispenses = sync_temp_dispense
      .query()
      .where((dispense) => {
        return (
          new Date(dispense.dispensedate) >= startDate &&
          new Date(dispense.dispensedate) <= endDate // &&  patients.includes(dispense.uuidopenmrs)
        );
      })
      .orderBy('dispensedate', 'desc')
      .get();

    return dispenses;
  },

  getDispensesFromLocalStorage(
    us: string,
    year: number,
    district: District,
    pharmacy: Clinic
  ) {
    const yearBefore = year - 1;
    const startDate = new Date('12-21-' + yearBefore);
    const endDate = new Date('12-20-' + year);

    let patients = [];
    if (
      pharmacy.value !== null &&
      pharmacy.value !== undefined &&
      us !== null &&
      us !== undefined &&
      us !== ''
    ) {
      patients =
        patientService.getPatientsByYearAndUSAndDistrictAndPharmacyFromLocalStorage(
          us,
          year,
          district,
          pharmacy
        );
    } else if (pharmacy.value !== null && pharmacy.value !== undefined) {
      patients =
        patientService.getPatientsByYearAndDistrictAndClinicAndPharmacyAndUSFromLocalStorage(
          year,
          district,
          pharmacy
        );
    } else if (us !== null && us !== undefined && us !== '') {
      patients =
        patientService.getPatientsByYearAndUSAndDistrictFromLocalStorage(
          us,
          year,
          district
        );
    } else {
      patients =
        patientService.getPatientsByYearAndDistrictAndClinicAndPharmacyFromLocalStorage(
          year,
          district,
          pharmacy
        );
    }

    patients = patients.map((patient) => patient.uuidopenmrs);
    const dispenses = sync_temp_dispense
      .query()
      .where((dispense) => {
        return (
          new Date(dispense.dispensedate) >= startDate &&
          new Date(dispense.dispensedate) <= endDate &&
          patients.includes(dispense.uuidopenmrs)
        );
      })
      .orderBy('dispensedate', 'desc')
      .get();

    return dispenses;
  },

  getDispensesByYearAndDistrictAndClinicAndPharmacyAndUSFromLocalStorage(
    us: Clinic,
    year: number,
    district: District,
    pharmacy: Clinic
  ) {
    const yearBefore = year - 1;
    const startDate = new Date('12-21-' + yearBefore);
    const endDate = new Date('12-20-' + year);

    let patients = [];
    if (pharmacy.value !== null && pharmacy.value !== undefined) {
      patients =
        patientService.getPatientsByYearAndDistrictAndClinicAndPharmacyAndUSFromLocalStorage(
          year,
          district,
          pharmacy
        );
    } else {
      patients =
        patientService.getPatientsByYearAndUSAndDistrictFromLocalStorage(
          us,
          year,
          district
        );
    }
    patients = patients.map((patient) => patient.uuidopenmrs);
    const dispenses = sync_temp_dispense
      .query()
      .where((dispense) => {
        return (
          new Date(dispense.dispensedate) >= startDate &&
          new Date(dispense.dispensedate) <= endDate // &&  patients.includes(dispense.uuidopenmrs)
        );
      })
      .orderBy('dispensedate', 'desc')
      .get();

    return dispenses;
  },
  getDCDispensesByYearAndDistrictAndClinicSectorFromLocalStorage(
    year: number,
    district: District,
    pharmacy: Clinic,
    usUuid: string
  ) {
    const yearBefore = year - 1;
    const startDate = new Date('12-21-' + yearBefore);
    const endDate = new Date('12-20-' + year);

    let patients: any[] = [];

    if (usUuid !== null && usUuid !== undefined) {
      patients =
        patientService.getDCPatientsByYearAndDistrictAndClinicSectorFromLocalStorage(
          year,
          district,
          pharmacy,
          usUuid
        );
    } else {
      patients =
        patientService.getAllDCPatientsByYearAndDistrictAndClinicSectorFromLocalStorage(
          year,
          district,
          pharmacy
        );
    }

    patients = patients.map((patient) => patient.uuidopenmrs);
    const dispenses = sync_temp_dispense
      .query()
      .where((dispense) => {
        return (
          new Date(dispense.dispensedate) >= startDate &&
          new Date(dispense.dispensedate) <= endDate &&
          patients.includes(dispense.uuidopenmrs)
        );
      })
      .orderBy('dispensedate', 'desc')
      .get();

    return dispenses;
  },
};
