import { ref } from 'vue';
import dist, { useRepo } from 'pinia-orm';
import Episode from 'src/stores/models/episode/episode';
import Patient from 'src/stores/models/patient/patient';
import api from '../apiService/apiService';
import moment from 'moment';
import clinicService from 'src/services/clinicService/clinicService';
import ClinicService from 'src/services/clinicService/clinicService';
import clinicSectorService from '../clinicSectorService/clinicSectorService';
import District from 'src/stores/models/district/district';
import Clinic from 'src/stores/models/clinic/clinic';
import { off } from 'process';
import useUtils from 'src/use/useUtils';
import { Loading, QSpinnerBall } from 'quasar';

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
    Loading.show({
      message: 'Carregando ...',
      spinnerColor: 'grey-4',
      spinner: QSpinnerBall,
    });

    if (offset >= 0) {
      return api()
        .get(
          'sync_temp_patients?estadopaciente=eq.Activo&offset=' +
            offset +
            '&limit=100'
        )
        .then((resp) => {
          sync_temp_patients.save(resp.data);
          if (resp.data.length > 0) {
            offset = offset + 100;
            this.get(offset);
          } else {
            Loading.hide();
          }
        })
        .catch((error) => {
          Loading.hide();
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
    return api()
      .patch('sync_temp_patients?id=eq.' + id, params)
      .then((resp) => {
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
  getPatientByUUidFromStorage(uuid: string) {
    return sync_temp_patients.query().where('uuidopenmrs', uuid).first();
  },
  getPatientGroupByClinicName() {
    return sync_temp_patients.groupBy('mainclinicname').get();
  },
  getAllPatientWithPrescriptionDate() {
    return sync_temp_patients
      .query()
      .where((patient) => {
        return patient.prescriptionenddate !== null;
      })
      .get();
  },

  getPatientsByYear(year: number) {
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
        'sync_temp_patients?estadopaciente=eq.Activo&prescriptiondate=gt.' +
          startDate +
          '&prescriptiondate=lt.' +
          endDate
      )
      .then((resp) => {
        sync_temp_patients.save(resp.data);
        Loading.hide();
      })
      .catch(() => {
        Loading.hide();
      });
  },

  getPharmaciesIdsByUS(usUuid: string) {
    const result = sync_temp_patients
      .query()
      .where((patient) => {
        return patient.mainclinicuuid === usUuid;
      })
      .groupBy('clinicuuid')
      .get();

    const resultPharmaciesIds = Object.keys(result);

    return resultPharmaciesIds;
  },

  getPatientsOnMainClinic(mainclinicname: string) {
    const res = sync_temp_patients
      .query()
      .where((patient) => {
        return patient.mainclinicname === mainclinicname;
      })
      .get();

    return res;
  },

  getUSByPatientsOnDistrict(district: string) {
    const result = [];

    let clinics = [];
    clinics = clinicService.getAllPharmacyFromDistrict(district); // Todas farmacias do distrito
    clinics = clinics.map((clinic) => clinic.uuid);

    const usResult = sync_temp_patients
      .query()
      .where((patient) => {
        return clinics.includes(patient.clinicuuid);
      })
      .groupBy('mainclinicname', 'mainclinicuuid')
      .get();

    for (const item of Object.keys(usResult)) {
      const minhaString = item;
      const partes = minhaString.split(/[\[,]/);
      const mainclinicname = partes[1].trim();
      const mainclinicuuid = partes[2].replace(']', '').trim();
      result.push({
        mainclinicname: mainclinicname,
        mainclinicuuid: mainclinicuuid,
      });
    }

    return result;
  },
  // US, Year, District and pharmacy
  getPatientsByYearAndDistrictAndClinicAndPharmacyAndUSFromLocalStorage(
    year: number,
    district: District,
    pharmacy: Clinic
  ) {
    const yearBefore = year - 1;
    const startDate = new Date('12-21-' + yearBefore);
    const endDate = new Date('12-20-' + year);

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
    return patients;
  },

  // Only US, Year, District
  getPatientsByYearAndUSAndDistrictFromLocalStorage(
    us: string,
    year: number,
    district: District
  ) {
    const yearBefore = year - 1;
    const startDate = new Date('12-21-' + yearBefore);
    const endDate = new Date('12-20-' + year);

    let clinics = [];

    clinics = ClinicService.getDDUSDistrictAndPharmFromLocalStorage(
      district,
      us
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
    return patients;
  },

  getPatientsByYearAndUSAndDistrictAndPharmacyFromLocalStorage(
    us: string,
    year: number,
    district: District,
    pharmacy: Clinic
  ) {
    const yearBefore = year - 1;
    const startDate = new Date('12-21-' + yearBefore);
    const endDate = new Date('12-20-' + year);

    let clinics = [];

    clinics = ClinicService.getDDUSDistrictAndPharmFromLocalStorage(
      district,
      us
    );
    clinics = clinics.map((clinic) => clinic.uuid);
    const patients = sync_temp_patients
      .query()
      .where((patient) => {
        return (
          patient.prescriptiondate !== null &&
          new Date(patient.prescriptiondate) >= startDate &&
          new Date(patient.prescriptiondate) <= endDate &&
          clinics.includes(patient.clinicuuid) &&
          patient.clinicname === pharmacy.value.clinicname
        );
      })
      .orderBy('prescriptiondate', 'desc')
      .get();
    return patients;
  },

  getPatientsByYearAndDistrictAndClinicAndPharmacyFromLocalStorage(
    year: number,
    district: District,
    pharmacy: Clinic
  ) {
    const yearBefore = year - 1;
    const startDate = new Date('12-21-' + yearBefore);
    const endDate = new Date('12-20-' + year);

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
    return patients;
  },

  getDCPatientsByYearAndDistrictAndClinicSectorFromLocalStorage(
    year: number,
    district: District,
    pharmacy: Clinic,
    usUuid
  ) {
    const yearBefore = year - 1;
    const startDate = new Date('12-21-' + yearBefore);
    const endDate = new Date('12-20-' + year);

    let clinicSectors = clinicSectorService.getAllFromStorage();
    clinicSectors = clinicSectors.map((clinicSector) => clinicSector.uuid);

    const patients = sync_temp_patients
      .query()
      .where((patient) => {
        return (
          patient.prescriptiondate !== null &&
          new Date(patient.prescriptiondate) >= startDate &&
          new Date(patient.prescriptiondate) <= endDate &&
          clinicSectors.includes(patient.clinicuuid) &&
          patient.mainclinicuuid === usUuid
        );
      })
      .orderBy('prescriptiondate', 'desc')
      .get();
    return patients;
  },

  getAllDCPatientsByYearAndDistrictAndClinicSectorFromLocalStorage(
    year: number,
    district: District,
    pharmacy: Clinic
  ) {
    const yearBefore = year - 1;
    const startDate = new Date('12-21-' + yearBefore);
    const endDate = new Date('12-20-' + year);

    let clinicSectors = clinicSectorService.getAllFromStorage();
    clinicSectors = clinicSectors.map((clinicSector) => clinicSector.uuid);
    const patients = sync_temp_patients
      .query()
      .where((patient) => {
        return (
          patient.prescriptiondate !== null &&
          new Date(patient.prescriptiondate) >= startDate &&
          new Date(patient.prescriptiondate) <= endDate &&
          clinicSectors.includes(patient.clinicuuid)
        );
      })
      .orderBy('prescriptiondate', 'desc')
      .get();
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

  getPatientsByDistrictAndUSFromLocalStorage(
    usName: string,
    pharmacy: Clinic,
    currPatient: Patient
  ) {
    let patients = sync_temp_patients
      .query()
      .where('mainclinicname', usName)
      .orderBy('prescriptiondate', 'desc')
      .get();

    if (pharmacy.value !== null && pharmacy.value !== undefined) {
      patients = sync_temp_patients
        .query()
        .where('mainclinicname', usName)
        .where('clinicname', pharmacy.value.clinicname)
        .orderBy('prescriptiondate', 'desc')
        .get();
    }

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

  getDCPatientsByClinicuuidFromLocalStorage(
    usUuid: string,
    clinic: Clinic,
    currPatient: Patient
  ) {
    let clinicSectors = clinicSectorService.getAllFromStorage();
    clinicSectors = clinicSectors.map((clinicSector) => clinicSector.uuid);

    let patients = sync_temp_patients
      .query()
      .where((patient) => {
        return (
          clinicSectors.includes(patient.clinicuuid) &&
          patient.mainclinicuuid === usUuid
        );
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

  getAllDCPatientsFromLocalStorage(
    district: District,
    pharmacy: Clinic,
    currPatient: Patient
  ) {
    let clinicSectors = clinicSectorService.getAllFromStorage();
    clinicSectors = clinicSectors.map((clinicSector) => clinicSector.uuid);

    let patients = sync_temp_patients
      .query()
      .where((patient) => {
        return clinicSectors.includes(patient.clinicuuid);
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
