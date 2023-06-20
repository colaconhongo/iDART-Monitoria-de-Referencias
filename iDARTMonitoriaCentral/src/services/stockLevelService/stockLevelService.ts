import { useRepo } from 'pinia-orm';
import StockLevel from 'src/stores/models/stockLevel/stockLevel';
import api from '../apiService/apiService';
import { Loading, QSpinnerBall } from 'quasar';

const stocklevel = useRepo(StockLevel);

export default {
  // Axios API call
  post(params: string) {
    return api()
      .post('stocklevel', params)
      .then((resp) => {
        stocklevel.save(resp.data);
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
        .get('stocklevel?offset=' + offset + '&limit=100')
        .then((resp) => {
          stocklevel.save(resp.data);
          offset = offset + 100;
          if (resp.data.length > 0) {
            this.get(offset);
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
      .patch('stocklevel/' + id, params)
      .then((resp) => {
        stocklevel.save(resp.data);
      });
  },
  delete(id: number) {
    return api()
      .delete('stocklevel/' + id)
      .then(() => {
        stocklevel.destroy(id);
      });
  },
  // Local Storage Pinia
  newInstanceEntity() {
    return stocklevel.getModel().$newInstance();
  },
  getAllFromStorage() {
    return stocklevel.all();
  },
};
