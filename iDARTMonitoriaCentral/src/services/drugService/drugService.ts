import { useRepo } from 'pinia-orm';
import Drug from 'src/stores/models/drugs/drug';
import api from '../apiService/apiService';
import { alert } from '../../components/Shared/Directives/Plugins/Dialog/dialog';

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
        .get('drug?offset=' + offset + '&limit=100')
        .then((resp) => {
          drug.save(resp.data);
          offset = offset + 100;
          if (resp.data.length > 0) {
            this.get(offset);
          }
        });
    }
  },
  patch(id: string, params: string) {
    return api()
      .patch('drug?id=eq.' + id, params)
      .then((resp) => {
        drug.save(JSON.parse(resp.config.data));
        alert(
          'Sucesso!',
          'O Registo foi alterado com sucesso',
          null,
          null,
          null
        );
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

  getAllGroupByStateClinic() {
    return drug.query().withAll().group;
  },
  getFromStorage(id: string) {
    return drug.find(id);
  },
};
