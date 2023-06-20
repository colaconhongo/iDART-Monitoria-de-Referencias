import { useRepo } from 'pinia-orm';
import Stock from 'src/stores/models/stock/stock';
import api from '../apiService/apiService';
import { alert } from '../../components/Shared/Directives/Plugins/Dialog/dialog';
import { Loading, QSpinnerBall } from 'quasar';

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
    Loading.show({
      message: 'Carregando ...',
      spinnerColor: 'grey-4',
      spinner: QSpinnerBall,
    });

    if (offset >= 0) {
      return api()
        .get('stock?select=*,drug(*)?offset=' + offset + '&limit=100')
        .then((resp) => {
          stock.save(resp.data);
          offset = offset + 100;
          if (resp.data.length > 0) {
            this.get(offset);
          }else{
            Loading.hide()
          }
        })
        .catch((error) => {
          Loading.hide()
          if (error.request != null) {
            const arrayErrors = JSON.parse(error.request.response);
            const listErrors = [];
            if (arrayErrors.total == null) {
              listErrors.push(arrayErrors.message);
            } else {
              arrayErrors._embedded.errors.forEach((element) => {
                listErrors.push(element.message);
              });
            }
            alert('Erro no registo', listErrors, null, null, null);
          } else if (error.request) {
            alert('Erro no registo', error.request, null, null, null);
          } else {
            alert('Erro no registo', error.message, null, null, null);
          }
        })
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
    return stock.query().withAll().get();
  },
  getByDrugIdFromStorage(drugId: string) {
    const list = stock
      .query()
      .with('mainDrug', (query) => {
        query.where('id', drugId);
      })
      .get();
    return list;
  },
};
