import { useRepo } from 'pinia-orm';
import Clinic from 'src/stores/models/clinic/clinic';
import api from '../apiService/apiService';
import { alert } from '../../components/Shared/Directives/Plugins/Dialog/dialog';

const clinic = useRepo(Clinic);

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
  get(offset: number) {
    if (offset >= 0) {
      return api()
        .get('clinic?offset=' + offset + '&limit=100')
        .then((resp) => {
          clinic.save(resp.data);
          offset = offset + 100;
          if (resp.data.length > 0) {
            setTimeout(this.get, 2);
          }
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
    }
  },
  patch(id: number, params: string) {
    return api()
      .patch('clinic?id=eq.' + id, params)
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
  delete(id: number) {
    return api()
      .delete('clinic?id=eq.' + id)
      .then((resp) => {
        clinic.destroy(id);
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
          alert('Erro no registo', listErrors, null, null, null);
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
};
