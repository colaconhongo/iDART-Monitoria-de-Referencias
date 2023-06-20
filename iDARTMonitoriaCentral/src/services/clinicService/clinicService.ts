import { Query, useRepo } from 'pinia-orm';
import Clinic from 'src/stores/models/clinic/clinic';
import api from '../apiService/apiService';
import patientService from '../patientService/patientService';
import { alert } from '../../components/Shared/Directives/Plugins/Dialog/dialog';
import District from 'src/stores/models/district/district';
import { timeStamp } from 'console';
import { Loading, QSpinnerBall } from 'quasar';
import ReferralClinic from 'src/stores/models/clinic/referalClinic';

const clinic = useRepo(Clinic);
const referralClinic = useRepo(ReferralClinic);

export default {
  post(params: string) {
    return api()
      .post('clinic', params)
      .then((resp) => {
        const clinicData = JSON.parse(resp.config.data);
        const restLocation = String(resp.headers.location);
        const restId = restLocation.substring(restLocation.indexOf('.') + 1);
        clinicData.id = Number(restId);
        clinic.save(clinicData);
        alert(
          'Sucesso!',
          'O Registo foi efectuado com sucesso',
          null,
          null,
          null
        );
      })
      .catch((error) => {
        if (error.request != null) {
          const arrayErrors = JSON.parse(error.request.response);
          const listErrors = [];
          if (arrayErrors.total == null) {
            listErrors.push(arrayErrors.message);
          } else {
            arrayErrors._embedded.errors.forEach((element) => {
              listErrors.push(element.message);
            });
          }
          alert('Erro no registo', listErrors, null, null, null);
        } else if (error.request) {
          alert('Erro no registo', error.request, null, null, null);
        } else {
          alert('Erro no registo', error.message, null, null, null);
        }
      });
  },

  getReferralClinics(offset: number) {
    Loading.show({
      message: 'Carregando ...',
      spinnerColor: 'grey-4',
      spinner: QSpinnerBall,
    });
    if (offset >= 0) {
      return api()
        .get('referal_clinics_vw?offset=' + offset + '&limit=100')
        .then((resp) => {
          referralClinic.save(resp.data);
          offset = offset + 100;
          if (resp.data.length > 0) {
            this.get(offset);
          } else {
            Loading.hide();
          }
        })
        .catch((error) => {
          Loading.hide();
          if (error.request != null) {
            const arrayErrors = JSON.parse(error.request.response);
            const listErrors = [];
            if (arrayErrors.total == null) {
              listErrors.push(arrayErrors.message);
            } else {
              arrayErrors._embedded.errors.forEach((element) => {
                listErrors.push(element.message);
              });
            }
            alert('Erro no registo', listErrors, null, null, null);
          } else if (error.request) {
            alert('Erro no registo', error.request, null, null, null);
          } else {
            alert('Erro no registo', error.message, null, null, null);
          }
        });
    }
  },
  get(offset: number) {
    Loading.show({
      message: 'Carregando ...',
      spinnerColor: 'grey-4',
      spinner: QSpinnerBall,
    });
    if (offset >= 0) {
      return api()
        .get('clinic?offset=' + offset + '&limit=100')
        .then((resp) => {
          clinic.save(resp.data);
          offset = offset + 100;
          if (resp.data.length > 0) {
            this.get(offset);
          } else {
            Loading.hide();
          }
        })
        .catch((error) => {
          Loading.hide();
          if (error.request != null) {
            const arrayErrors = JSON.parse(error.request.response);
            const listErrors = [];
            if (arrayErrors.total == null) {
              listErrors.push(arrayErrors.message);
            } else {
              arrayErrors._embedded.errors.forEach((element) => {
                listErrors.push(element.message);
              });
            }
            alert('Erro no registo', listErrors, null, null, null);
          } else if (error.request) {
            alert('Erro no registo', error.request, null, null, null);
          } else {
            alert('Erro no registo', error.message, null, null, null);
          }
        });
    }
  },
  patch(uid: string, params: string) {
    return api()
      .patch('clinic?uuid=eq.' + uid, params)
      .then((resp) => {
        clinic.save(JSON.parse(resp.config.data));
        alert(
          'Sucesso!',
          'O Registo foi alterado com sucesso',
          null,
          null,
          null
        );
      })
      .catch((error) => {
        if (error.request != null) {
          const arrayErrors = JSON.parse(error.request.response);
          const listErrors = [];
          if (arrayErrors.total == null) {
            listErrors.push(arrayErrors.message);
          } else {
            arrayErrors._embedded.errors.forEach((element) => {
              listErrors.push(element.message);
            });
          }
          alert('Erro no registo', listErrors, '', '', '');
        } else if (error.request) {
          alert('Erro no registo', error.request, '', '', '');
        } else {
          alert('Erro no registo', error.message, '', '', '');
        }
      });
  },
  delete(uuid: string) {
    return api()
      .delete('clinic?uuid=eq.' + uuid)
      .then((resp) => {
        clinic.destroy(uuid);
        alert(
          'Sucesso!',
          'O Registo foi removido com sucesso',
          null,
          null,
          null
        );
      })
      .catch((error) => {
        if (error.request != null) {
          const arrayErrors = JSON.parse(error.request.response);
          const listErrors = [];
          if (arrayErrors.total == null) {
            listErrors.push(arrayErrors.message);
          } else {
            arrayErrors._embedded.errors.forEach((element) => {
              listErrors.push(element.message);
            });
          }
          alert(
            'Erro no registo',
            'Esta farmácia tem pacientes assossiados e não pode ser removida',
            null,
            null,
            null
          );
        } else if (error.request) {
          alert('Erro no registo', error.request, null, null, null);
        } else {
          alert('Erro no registo', error.message, null, null, null);
        }
      });
  },
  // Confirmation
  closeAlert() {
    return false;
  },
  // Local Storage Pinia
  newInstanceEntity() {
    return clinic.getModel().$newInstance();
  },

  getAllFromStorage() {
    return clinic.all();
  },
  getAllPharmacyFromDistrict(district: string) {
    return clinic
      .query()
      .where((clinics) => {
        return (
          clinics.facilitytype !== 'Unidade Sanitária' &&
          clinics.district === district
        );
      })
      .orderBy('facilitytype')
      .orderBy('clinicname', 'desc')
      .get();
  },
  getAllPharmacyFromDistrictAndUS(district: string, mainclinicname: string) {
    let patientsOnMainClinic =
      patientService.getPatientsOnMainClinic(mainclinicname);
    patientsOnMainClinic = patientsOnMainClinic.map(
      (patient) => patient.clinicuuid
    );
    const res = clinic
      .query()
      .where((clinic) => {
        return (
          clinic.district === district &&
          patientsOnMainClinic.includes(clinic.uuid)
        );
      })
      .orderBy('facilitytype')
      .orderBy('clinicname', 'desc')
      .get();
    return res;
  },
  getAllUSFromDistrict(district: string) {
    return clinic
      .query()
      .where((clinics) => {
        return (
          clinics.facilitytype === 'Unidade Sanitária' &&
          clinics.district === district
        );
      })
      .orderBy('facilitytype')
      .orderBy('clinicname', 'desc')
      .get();
  },
  getPharmaciesByUuidList(uuidList: []) {
    const result = clinic
      .query()
      .whereIn('uuid', uuidList)
      .orderBy('facilitytype')
      .orderBy('clinicname', 'desc')
      .get();
    return result;
  },
  getClinicByID(uuid: string) {
    return clinic.query().where('uuid', uuid).get();
  },
  getAllDDPharm() {
    return clinic
      .query()
      .where((clinics) => {
        return (
          clinics.facilitytype !== 'Unidade Sanitária' &&
          clinics.province === localStorage.getItem('province_name')
        );
      })
      .orderBy('facilitytype')
      .orderBy('clinicname', 'desc')
      .get();
  },

  getAllByDistrict(district) {
    return clinic
      .query()
      .where((clinics) => {
        return clinics.district === district.name;
      })
      .orderBy('facilitytype')
      .orderBy('clinicname', 'desc')
      .get();
  },

  getPharmByUUid(uuid: string) {
    return clinic.query().where('uuid', uuid).get();
  },

  getAllUS() {
    return clinic
      .query()
      .where((clinics) => {
        return clinics.facilitytype === 'Unidade Sanitária';
      })
      .orderBy('facilitytype')
      .orderBy('clinicname', 'desc')
      .get();
  },

  getDDPharmByDistrictAndPharmFromLocalStorage(
    district: District,
    pharmacy: Clinic
  ) {
    let clinics = [];

    if (pharmacy.value != null || pharmacy.value != undefined) {
      clinics.push(pharmacy.value);
    } else if (district.value != null || district.value != undefined) {
      clinics = this.getAllPharmacyFromDistrict(district.value.name);
    } else {
      clinics = this.getAllDDPharm();
    }
    return clinics;
  },

  getDDUSDistrictAndPharmFromLocalStorage(
    district: District,
    mainclinicname: string
  ) {
    let clinics = [];
    clinics = this.getAllPharmacyFromDistrictAndUS(
      district.value.name,
      mainclinicname
    );

    return clinics;
  },

  getReferralClinicByDistrict(districtname: string) {
    return referralClinic.where('district', districtname).get();
  },
};
