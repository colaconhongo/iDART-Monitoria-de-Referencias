import { useRepo } from 'pinia-orm';
import api from '../apiService/apiService';
import { alert } from '../../components/Shared/Directives/Plugins/Dialog/dialog';
import ClinicInformation from 'src/stores/models/clinicInformation/clinicInformation';

const sync_temp_clinic_information = useRepo(ClinicInformation);

export default {
  // Axios API call
  post(params: string) {
    return api()
      .post('sync_temp_clinic_information', params)
      .then((resp) => {
        sync_temp_clinic_information.save(resp.data);
      });
  },
  get(offset: number) {
    if (offset >= 0) {
      return api()
        .get('sync_temp_clinic_information?offset=' + offset + '&limit=100')
        .then((resp) => {
          sync_temp_clinic_information.save(resp.data);
          offset = offset + 100;
          if (resp.data.length > 0) {
            this.get(offset);
          }
        });
    }
  },
  patch(id: number, params: string) {
    return api()
      .patch('sync_temp_clinic_information/' + id, params)
      .then((resp) => {
        sync_temp_clinic_information.save(resp.data);
      });
  },
  delete(id: number) {
    return api()
      .delete('sync_temp_clinic_information/' + id)
      .then(() => {
        sync_temp_clinic_information.destroy(id);
      });
  },
  // Local Storage Pinia
  newInstanceEntity() {
    return sync_temp_clinic_information.getModel().$newInstance();
  },
  getAllFromStorage() {
    return sync_temp_clinic_information.all();
  },
  getClinicInformationByPatientUuid(patientUuid) {
    const list =  sync_temp_clinic_information.query().where('patientuuid', patientUuid).orderBy('registerdate', 'desc').
    get();
    return list;
  },
};
