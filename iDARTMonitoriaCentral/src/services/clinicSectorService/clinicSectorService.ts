import { useRepo } from 'pinia-orm';
import ClinicSector from 'src/stores/models/clinicSector/ClinicSector';
import api from '../apiService/apiService';

const clinicsector = useRepo(ClinicSector);

export default {
  // Axios API call
  post(params: string) {
    return api()
      .post('clinicsector', params)
      .then((resp) => {
        clinicsector.save(resp.data);
      });
  },
  get(offset: number) {
    if (offset >= 0) {
      return api()
        .get('clinicsector?offset=' + offset + '&max=100')
        .then((resp) => {
          clinicsector.save(resp.data);
          offset = offset + 100;
          if (resp.data.length > 0) {
            setTimeout(this.get, 2);
          }
        });
    }
  },
  patch(id: number, params: string) {
    return api()
      .patch('clinicsector/' + id, params)
      .then((resp) => {
        clinicsector.save(resp.data);
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
    return clinicsector.all();
  },
};
