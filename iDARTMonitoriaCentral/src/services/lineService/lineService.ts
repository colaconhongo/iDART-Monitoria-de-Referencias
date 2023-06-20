import { useRepo } from 'pinia-orm';
import Line from 'src/stores/models/line/line';
import api from '../apiService/apiService';
import { Loading, QSpinnerBall } from 'quasar';

const linhat = useRepo(Line);

export default {
  // Axios API call
  post(params: string) {
    return api()
      .post('linhat', params)
      .then((resp) => {
        linhat.save(resp.data);
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
        .get('linhat?offset=' + offset + '&limit=100')
        .then((resp) => {
          linhat.save(resp.data);
          offset = offset + 100;
          if (resp.data.length > 0) {
            setTimeout(this.get, 2);
          } else {
            Loading.hide();
          }
        })
        .catch(() => {
          Loading.hide();
        });
    }
  },
  patch(id: number, params: string) {
    return api()
      .patch('linhat/' + id, params)
      .then((resp) => {
        linhat.save(resp.data);
      });
  },
  delete(id: number) {
    return api()
      .delete('linhat/' + id)
      .then(() => {
        linhat.destroy(id);
      });
  },
  // Local Storage Pinia
  newInstanceEntity() {
    return linhat.getModel().$newInstance();
  },
  getAllFromStorage() {
    return linhat.all();
  },
};
