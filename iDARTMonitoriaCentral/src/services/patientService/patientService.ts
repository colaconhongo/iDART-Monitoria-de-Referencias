import dist, { useRepo } from 'pinia-orm';
import Episode from 'src/stores/models/episode/episode';
import Patient from 'src/stores/models/patient/patient';
import api from '../apiService/apiService';
import moment from 'moment';
import ClinicService from 'src/services/clinicService/clinicService';
import clinicSectorService from '../clinicSectorService/clinicSectorService';
import District from 'src/stores/models/district/district';
import Clinic from 'src/stores/models/clinic/clinic';
import { off } from 'process';

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
          if (resp.data.length > 0) {
            offset = offset + 100;
            // setTimeout(this.get, 1000,offset);
             this.get(offset);
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
          if (resp.data.length > 0) {
            setTimeout(this.get, 2);
          }
        })
    );
  },
  patch(id: number, params: string) {
    console.log(params);
    return api()
      .patch('sync_temp_patients?id=eq.' + id, params)
      .then((resp) => {
        console.log(resp);
        sync_temp_patients.save(JSON.parse(resp.config.data));
      })
      .catch((error) => {
        console.error(error);
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
    const yearBefore = year - 1;
    const startDate = moment('12-21-' + yearBefore).format('MM-DD-YYYY');
    console.log(startDate);
    const endDate = moment('12-20-' + year).format('MM-DD-YYYY');
    return api()
      .get(
        'sync_temp_patients?prescriptiondate=gt.' +
          startDate +
          '&prescriptiondate=lt.' +
          endDate
      )
      .then((resp) => {
        sync_temp_patients.save(resp.data);
      });
  },

  getPatientsByYearAndDistrictAndClinicAndPharmacyFromLocalStorage(
    year: number,
    district: District,
    pharmacy: Clinic
  ) {
    const yearBefore = year - 1;
    const startDate = new Date('12-21-' + yearBefore);
    console.log(startDate);
    const endDate = new Date('12-20-' + year);
    console.log(endDate);

    let clinics = [];

    clinics = ClinicService.getDDPharmByDistrictAndPharmFromLocalStorage(
      district,
      pharmacy
    );
    clinics = clinics.map((clinic) => clinic.uuid);
    const patients = sync_temp_patients
      .query()
      .where((patient) => {
        return (
          patient.prescriptiondate !== null &&
          new Date(patient.prescriptiondate) >= startDate &&
          new Date(patient.prescriptiondate) <= endDate &&
          clinics.includes(patient.clinicuuid)
        );
      })
      .orderBy('prescriptiondate', 'desc')
      .get();
    console.log(patients);
    return patients;
  },

  getPatientsByDistrictAndPharmacyFromLocalStorage(
    district: District,
    pharmacy: Clinic,
    currPatient: Patient
  ) {
    let clinics = [];
    clinics = ClinicService.getDDPharmByDistrictAndPharmFromLocalStorage(
      district,
      pharmacy
    );
    clinics = clinics.map((clinic) => clinic.uuid);
    let patients = sync_temp_patients
      .query()
      .where((patient) => {
        return clinics.includes(patient.clinicuuid);
      })
      .orderBy('prescriptiondate', 'desc')
      .get();

    if (
      currPatient.patientid.length > 0 ||
      currPatient.firstnames.length > 0 ||
      currPatient.lastname.length > 0
    ) {
      patients = patients.filter((patient) => {
        return this.filterPatient(patient, currPatient);
      });
    }
    return patients;
  },

  filterPatient(patient: Patient, currPatient: Patient) {
    return (
      this.stringContains(patient.patientid, currPatient.patientid) ||
      this.stringContains(patient.firstnames, currPatient.firstnames) ||
      this.stringContains(patient.lastname, currPatient.lastname)
    );
  },

  stringContains(stringToCheck: string, stringText: string) {
    if (
      stringToCheck === '' ||
      stringToCheck === null ||
      stringToCheck === undefined
    )
      return false;
    if (stringText === '' || stringText === null || stringText === undefined)
      return false;
    return stringToCheck.toLowerCase().includes(stringText.toLowerCase());
  },
};
