import { useRepo } from 'pinia-orm';
import StockCenter from 'src/stores/models/stockCenter/stockCenter';
import api from '../apiService/apiService';
import { Loading, QSpinnerBall } from 'quasar';

const stockcenter = useRepo(StockCenter);

export default {
  // Axios API call
  post(params: string) {
    return api()
      .post('stockcenter', params)
      .then((resp) => {
        stockcenter.save(resp.data);
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
        .get('stockcenter?offset=' + offset + '&limit=100')
        .then((resp) => {
          stockcenter.save(resp.data);
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
      .patch('stockcenter/' + id, params)
      .then((resp) => {
        stockcenter.save(resp.data);
      });
  },
  delete(id: number) {
    return api()
      .delete('stockcenter/' + id)
      .then(() => {
        stockcenter.destroy(id);
      });
  },
  // Local Storage Pinia
  newInstanceEntity() {
    return stockcenter.getModel().$newInstance();
  },
  getAllFromStorage() {
    return stockcenter.all();
  },
};
