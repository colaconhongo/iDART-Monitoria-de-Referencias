import { useRepo } from 'pinia-orm';
import Regimen from 'src/stores/models/regimen/regimen';
import api from '../apiService/apiService';
import { alert } from '../../components/Shared/Directives/Plugins/Dialog/dialog';

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
            this.get(offset);
          }
        });
    }
  },
  patch(id: number, params: string) {
    return api()
      .patch('regimeterapeutico?regimeid=eq.' + id, params)
      .then((resp) => {
        regimeterapeutico.save(JSON.parse(resp.config.data));
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
