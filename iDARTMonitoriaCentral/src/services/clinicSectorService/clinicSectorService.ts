import { useRepo } from 'pinia-orm';
import ClinicSector from 'src/stores/models/clinicSector/clinicSector';
import api from '../apiService/apiService';
import { alert } from '../../components/Shared/Directives/Plugins/Dialog/dialog';
import { Loading, QSpinnerBall } from 'quasar';

const clinicsector = useRepo(ClinicSector);

export default {
  // Axios API call
  post(params: string) {
    return api()
      .post('clinicsector', params)
      .then((resp) => {
        clinicsector.save(resp.data);
      })
      .catch((error) => {
        if (error.request != null) {
          const arrayErrors = JSON.parse(error.request.response);
          const listErrors = {};
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
    Loading.show({
      message: 'Carregando ...',
      spinnerColor: 'grey-4',
      spinner: QSpinnerBall,
    });
    if (offset >= 0) {
      return api()
        .get('clinicsector?offset=' + offset + '&limit=100')
        .then((resp) => {
          clinicsector.save(resp.data);
          offset = offset + 100;
          if (resp.data.length > 0) {
            setTimeout(this.get, 2);
          } else {
            Loading.hide();
          }
        })
        .catch((error) => {
          Loading.hide();
          if (error.request != null) {
            const arrayErrors = JSON.parse(error.request.response);
            const listErrors = {};
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
  getAllFromClinicUuidList(clinicUuidList: string, offset: number) {
    if (offset >= 0) {
      return api()
        .get(
          'clinicsector?select=*,clinicuuid=in.(' +
            clinicUuidList +
            ')&offset=' +
            offset +
            '&limit=100'
        )
        .then((resp) => {
          clinicsector.save(resp.data);
          offset = offset + 100;
          if (resp.data.length > 0) {
            setTimeout(
              this.getAllFromClinicUuidList(clinicUuidList, offset),
              2
            );
          } else {
            Loading.hide();
          }
        })
        .catch((error) => {
          Loading.hide();
          if (error.request != null) {
            const arrayErrors = JSON.parse(error.request.response);
            const listErrors = {};
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
      .patch('clinicsector/' + id, params)
      .then((resp) => {
        clinicsector.save(resp.data);
      })
      .catch((error) => {
        if (error.request != null) {
          const arrayErrors = JSON.parse(error.request.response);
          const listErrors = {};
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
  delete(id: number) {
    return api()
      .delete('clinicsector/' + id)
      .then(() => {
        clinicsector.destroy(id);
      });
  },
  // Local Storage Pinia
  newInstanceEntity() {
    return clinicsector.getModel().$newInstance();
  },
  getAllFromStorage() {
    return clinicsector.query().withAll().get();
  },

  getByUuidFromStorage(clinicsectoruuid: string) {
    return clinicsector.query().withAll().where('uuid', clinicsectoruuid).get();
  },
  getAllBySectorTypeFromStorage(sectorType_id: number) {
    return clinicsector.query().where('clinicsectortype', sectorType_id).get();
  },

  getAllByClinicUuidFromStorage(clinicuuid: string) {
    return clinicsector.query().where('clinic', clinicuuid).get();
  },
};
