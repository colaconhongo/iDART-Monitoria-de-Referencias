import { useRepo } from 'pinia-orm';
import Drug from 'src/stores/models/drugs/drug';
import api from '../apiService/apiService';

const drug = useRepo(Drug);

export default {
  // Axios API call
  post(params: string) {
    return api()
      .post('drug', params)
      .then((resp) => {
        drug.save(resp.data);
      });
  },
  get(offset: number) {
    if (offset >= 0) {
      return api()
        .get('drug?offset=' + offset + '&max=100')
        .then((resp) => {
          drug.save(resp.data);
          offset = offset + 100;
          if (resp.data.length > 0) {
            setTimeout(this.get, 2);
          }
        });
    }
  },
  patch(id: number, params: string) {
    return api()
      .patch('drug/' + id, params)
      .then((resp) => {
        drug.save(resp.data);
      });
  },
  delete(id: number) {
    return api()
      .delete('drug/' + id)
      .then(() => {
        drug.destroy(id);
      });
  },
  // Local Storage Pinia
  newInstanceEntity() {
    return drug.getModel().$newInstance();
  },
  getAllFromStorage() {
    return drug.all();
  },
};
