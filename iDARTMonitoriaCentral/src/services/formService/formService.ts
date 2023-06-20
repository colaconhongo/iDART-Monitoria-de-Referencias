import { useRepo } from 'pinia-orm';
import Form from 'src/stores/models/form/form';
import api from '../apiService/apiService';
import { Loading, QSpinnerBall } from 'quasar';

const form = useRepo(Form);

export default {
  // Axios API call
  post(params: string) {
    return api()
      .post('form', params)
      .then((resp) => {
        form.save(resp.data);
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
        .get('form?offset=' + offset + '&limit=100')
        .then((resp) => {
          form.save(resp.data);
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
      .patch('form/' + id, params)
      .then((resp) => {
        form.save(resp.data);
      });
  },
  delete(id: number) {
    return api()
      .delete('form/' + id)
      .then(() => {
        form.destroy(id);
      });
  },
  // Local Storage Pinia
  newInstanceEntity() {
    return form.getModel().$newInstance();
  },
  getAllFromStorage() {
    return form.all();
  },
  getFormByID(id: number) {
    return form.query().where('id', id).first();
  },
  getFormByName(drugname: string) {
    return form.query().where('form', drugname).get();
  },
};
