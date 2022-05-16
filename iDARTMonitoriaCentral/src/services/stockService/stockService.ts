import { useRepo } from 'pinia-orm';
import Stock from 'src/stores/models/stock/stock';
import api from '../apiService/apiService';

const stock = useRepo(Stock);

export default {
  // Axios API call
  post(params: string) {
    return api()
      .post('stock', params)
      .then((resp) => {
        stock.save(resp.data);
      });
  },
  get(offset: number) {
    if (offset >= 0) {
      return api()
        .get('stock?offset=' + offset + '&max=100')
        .then((resp) => {
          stock.save(resp.data);
          offset = offset + 100;
          if (resp.data.length > 0) {
            setTimeout(this.get, 2);
          }
        });
    }
  },
  patch(id: number, params: string) {
    return api()
      .patch('stock/' + id, params)
      .then((resp) => {
        stock.save(resp.data);
      });
  },
  delete(id: number) {
    return api()
      .delete('stock/' + id)
      .then(() => {
        stock.destroy(id);
      });
  },
  // Local Storage Pinia
  newInstanceEntity() {
    return stock.getModel().$newInstance();
  },
  getAllFromStorage() {
    return stock.all();
  },
};
