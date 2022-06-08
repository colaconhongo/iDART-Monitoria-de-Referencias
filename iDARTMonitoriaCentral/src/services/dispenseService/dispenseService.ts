import { useRepo } from 'pinia-orm';
import Dispense from 'src/stores/models/dispense/dispense';
import patientService from 'src/services/patientService/patientService';
import api from '../apiService/apiService';
import moment from 'moment';

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
            setTimeout(this.get(offset), 2);
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
      return dispense.dispensatrimestral === 1 })
.get();
  },
  getAllDispenseSemestre() {
    return sync_temp_dispense
    .query()
    .where((dispense) => {
      return dispense.dispensasemestral === 1 })
.get();
  },
  getAllDispenseMensal() {
    return sync_temp_dispense
    .query()
    .where((dispense) => {
      return dispense.dispensasemestral === 0 && dispense.dispensatrimestral === 0})
.get();
  },

  getDispensesByRegimeByYear(year) {
    const yearBefore = year -1;
    const startDate =  moment('12-21-'+yearBefore).format('MM-DD-YYYY')
    console.log(startDate)
    const endDate = moment('12-20-'+year).format('MM-DD-YYYY')
    console.log(endDate)
      return api()
        .get('sync_temp_dispense?dispensedate=gt.'+startDate+'&dispensedate=lt.'+endDate)
        .then((resp) => {
          sync_temp_dispense.save(resp.data);
        });
  },
  
  getDispensesByRegimeByYearFromLocalStorage (year) {
  // const startDate =  moment('01-01-'+year).format('DD-MM-YYYY')
  const startDate = new Date('01-01-'+year)
  console.log(startDate)
//  const endDate = moment('12-31-'+year).format('DD-MM-YYYY')
const endDate = new Date('12-31-'+year)
  console.log(endDate)
    const dispenses = sync_temp_dispense
    .query()
    .where((dispense) => {
      return new Date(dispense.dispensedate) >= startDate && new Date(dispense.dispensedate) <= endDate })
      .orderBy('dispensedate','desc')
.get();
    return dispenses
  },

  getDispensesByYearAndDistrictAndClinicAndPharmacyFromLocalStorage (year, district, clinic,pharmacy) {
    const yearBefore = year -1;
    const startDate = new Date('12-21-'+yearBefore)
    console.log(startDate)
  const endDate = new Date('12-20-'+year)
    console.log(endDate)

    let patients = patientService.getPatientsByYearAndDistrictAndClinicAndPharmacyFromLocalStorage(year , district , clinic, pharmacy);
    patients = patients.map(patient => patient.uuidopenmrs);
    console.log(patients)
      const dispenses = sync_temp_dispense
      .query()
      .where((dispense) => {
        return new Date(dispense.dispensedate) >= startDate && new Date(dispense.dispensedate) <= endDate  &&
        patients.includes(dispense.uuidopenmrs)})
        .orderBy('dispensedate','desc')
  .get();
      return dispenses
    },
};
