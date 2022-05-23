import { useRepo } from 'pinia-orm';
import Regimen from 'src/stores/models/regimen/regimen';
import api from '../apiService/apiService';

const regimeterapeutico = useRepo(Regimen);

export default {
  // Axios API call
  post(params: string) {
    return api()
      .post('regimeterapeutico', params)
      .then((resp) => {
        regimeterapeutico.save(resp.data);
      });
  },
  get(offset: number) {
    if (offset >= 0) {
      return api()
        .get('regimeterapeutico?offset=' + offset + '&limit=100')
        .then((resp) => {
          regimeterapeutico.save(resp.data);
          offset = offset + 100;
          if (resp.data.length > 0) {
            setTimeout(this.get, 2);
          }
        });
    }
  },
  patch(id: number, params: string) {
    return api()
      .patch('regimeterapeutico/' + id, params)
      .then((resp) => {
        regimeterapeutico.save(resp.data);
      });
  },
  delete(id: number) {
    return api()
      .delete('regimeterapeutico/' + id)
      .then(() => {
        regimeterapeutico.destroy(id);
      });
  },
  // Local Storage Pinia
  newInstanceEntity() {
    return regimeterapeutico.getModel().$newInstance();
  },
  getAllFromStorage() {
    return regimeterapeutico.all();
  },
};
