import { useRepo } from 'pinia-orm';
import Province from 'src/stores/models/province/province';
import api from '../apiService/apiService';

const province = useRepo(Province);

export default {
  // Axios API call
  post(params: string) {
    return api()
      .post('province', params)
      .then((resp) => {
        province.save(resp.data);
      });
  },
  get(offset: number) {
    if (offset >= 0) {
      return api()
        .get('province?offset=' + offset + '&limit=100')
        .then((resp) => {
          province.save(resp.data);
          offset = offset + 100;
          if (resp.data.length > 0) {
            this.get(offset);
          }
        });
    }
  },
  patch(id: number, params: string) {
    return api()
      .patch('province/' + id, params)
      .then((resp) => {
        province.save(resp.data);
      });
  },
  delete(id: number) {
    return api()
      .delete('province/' + id)
      .then(() => {
        province.destroy(id);
      });
  },
  // Local Storage Pinia
  newInstanceEntity() {
    return province.getModel().$newInstance();
  },
  getAllFromStorage() {
    return province.all();
  },
  getProvinceByNameFromStorage() {
    return province
      .query()
      .where('name', localStorage.getItem('province_name'))
      .get();
  },
  getFirstProvinceByNameFromStorage() {
    return province
      .query()
      .where('name', localStorage.getItem('province_name'))
      .first();
  },
};
