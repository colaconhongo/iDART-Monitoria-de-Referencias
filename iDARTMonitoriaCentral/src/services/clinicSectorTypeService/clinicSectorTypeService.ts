import { useRepo } from 'pinia-orm';
import ClinicSectorType from 'src/stores/models/clinicSectorType/clinicSectorType';
import api from '../apiService/apiService';

const clinic_sector_type = useRepo(ClinicSectorType);

export default {
  // Axios API call
  post(params: string) {
    return api()
      .post('clinic_sector_type', params)
      .then((resp) => {
        clinic_sector_type.save(resp.data);
      });
  },
  get(offset: number) {
    if (offset >= 0) {
      return api()
        .get('clinic_sector_type?offset=' + offset + '&max=100')
        .then((resp) => {
          clinic_sector_type.save(resp.data);
          offset = offset + 100;
          if (resp.data.length > 0) {
            setTimeout(this.get, 2);
          }
        });
    }
  },
  patch(id: number, params: string) {
    return api()
      .patch('clinic_sector_type/' + id, params)
      .then((resp) => {
        clinic_sector_type.save(resp.data);
      });
  },
  delete(id: number) {
    return api()
      .delete('clinic_sector_type/' + id)
      .then(() => {
        clinic_sector_type.destroy(id);
      });
  },
  // Local Storage Pinia
  newInstanceEntity() {
    return clinic_sector_type.getModel().$newInstance();
  },
  getAllFromStorage() {
    return clinic_sector_type.all();
  },
};
