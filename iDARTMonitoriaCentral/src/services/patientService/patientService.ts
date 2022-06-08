import dist, { useRepo } from 'pinia-orm';
import Episode from 'src/stores/models/episode/episode';
import Patient from 'src/stores/models/patient/patient';
import api from '../apiService/apiService';
import moment from 'moment';
import ClinicService from 'src/services/clinicService/clinicService';
import clinicSectorService from '../clinicSectorService/clinicSectorService';

const sync_temp_patients = useRepo(Patient);
const sync_temp_episode = useRepo(Episode);

export default {
  // Axios API call
  post(params: string) {
    return api()
      .post('sync_temp_patients', params)
      .then((resp) => {
        sync_temp_patients.save(resp.data);
      });
  },
  get(offset: number) {
    if (offset >= 0) {
      return api()
        .get('sync_temp_patients?offset=' + offset + '&limit=100')
        .then((resp) => {
          sync_temp_patients.save(resp.data);
          offset = offset + 100;
          if (resp.data.length > 0) {
            setTimeout(this.get, 2);
          }
        })
        .catch((error) => {
          // if (error.request != null) {
          //   const arrayErrors = JSON.parse(error.request.response);
          //   const listErrors = [];
          //   if (arrayErrors.total == null) {
          //     listErrors.push(arrayErrors.message);
          //   } else {
          //     arrayErrors._embedded.errors.forEach((element) => {
          //       listErrors.push(element.message);
          //     });
          //   }
          //   alert('Erro no registo', listErrors, null, null, null);
          // } else if (error.request) {
          //   alert('Erro no registo', error.request, null, null, null);
          // } else {
          //   alert('Erro no registo', error.message, null, null, null);
          // }
        });
    }
  },
  getById(id: string) {
    return (
      api()
        //.get('/sync_temp_patients?uuidopenmrs=eq.' + id + ',sync_temp_episode(*)')

        .get('/sync_temp_patients?select(*)&uuidopenmrs=eq.' + id)

        .then((resp) => {
          sync_temp_patients.save(resp.data);
          alert('After Save');
          if (resp.data.length > 0) {
            console.log('Ai esta teu resultado: ', resp.data);
            setTimeout(this.get, 2);
          }
        })
    );
  },

  patch(id: number, params: string) {
    return api()
      .patch('sync_temp_patients/' + id, params)
      .then((resp) => {
        sync_temp_patients.save(resp.data);
      });
  },
  delete(id: number) {
    return api()
      .delete('sync_temp_patients/' + id)
      .then(() => {
        sync_temp_patients.destroy(id);
      });
  },
  // Local Storage Pinia
  newInstanceEntity() {
    return sync_temp_patients.getModel().$newInstance();
  },
  getAllFromStorage() {
    return sync_temp_patients.all();
    alert('returned');
  },

  getAllPatientWithPrescriptionDate() {
    return sync_temp_patients
      .query()
      .where((patient) => {
        return patient.prescriptionenddate !== null;
      })
      .get();
  },

  getPatientsByYear(year) {
  const yearBefore = year -1;
    const startDate =  moment('12-21-'+yearBefore).format('MM-DD-YYYY')
    console.log(startDate)
    const endDate = moment('12-20-'+year).format('MM-DD-YYYY')
      return api()
        .get('sync_temp_patients?prescriptiondate=gt.'+startDate+'&prescriptiondate=lt.'+endDate)
        .then((resp) => {
          sync_temp_patients.save(resp.data);
        });
  },

  getPatientsByYearAndDistrictAndClinicAndPharmacyFromLocalStorage(year, district, clinic,pharmacy) {
    const yearBefore = year -1;
    const startDate = new Date('12-21-'+yearBefore)
    console.log(startDate)
  const endDate = new Date('12-20-'+year)
    console.log(endDate)

     let clinics = [] ;

     if (pharmacy.value != null || pharmacy.value != undefined) {
      clinics.push(pharmacy.value.uuid)
     } 
     else if (district.value != null || district.value != undefined) {
      clinics = ClinicService.getAllByDistrict(district.value)
       clinics = clinics.map(clinic => clinic.uuid);
       console.log(clinics)
     }
     const patients = sync_temp_patients
     .query()
     .where((patient) => {
       return patient.prescriptiondate !== null &&
       new Date(patient.prescriptiondate)>= startDate && new Date(patient.prescriptiondate) <= endDate &&
         (clinics.length > 0 ? clinics.includes(patient.clinicuuid) : patient.prescriptiondate)})
       .orderBy('prescriptiondate','desc')
 .get();
    console.log(patients)
     return patients
   },
};
