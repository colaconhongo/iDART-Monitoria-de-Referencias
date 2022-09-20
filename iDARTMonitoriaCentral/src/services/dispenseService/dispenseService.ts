import { useRepo } from 'pinia-orm';
import Dispense from 'src/stores/models/dispense/dispense';
import patientService from 'src/services/patientService/patientService';
import api from '../apiService/apiService';
import moment from 'moment';
import District from 'src/stores/models/district/district';
import Clinic from 'src/stores/models/clinic/clinic';
import useUtils from 'src/use/useUtils';

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
    if (offset >= 0) {
      return api()
        .get('sync_temp_dispense?offset=' + offset + '&limit=100')
        .then((resp) => {
          sync_temp_dispense.save(resp.data);
          offset = offset + 100;
          if (resp.data.length > 0) {
            this.get(offset);
          }
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
};
