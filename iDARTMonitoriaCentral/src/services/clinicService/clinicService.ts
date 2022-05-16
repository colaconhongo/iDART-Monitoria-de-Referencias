import { useRepo } from 'pinia-orm';
import Clinic from 'src/stores/models/clinic/clinic';
import api from '../apiService/apiService';

const clinic = useRepo(Clinic);

export default {
  post(params: string) {
    return api()
      .post('clinic', params)
      .then((resp) => {
        console.log(resp);
        clinic.save(resp.data);
      })
      .catch((error) => {
        if (error.response) {
          console.error(error.response);
        } else if (error.request) {
          console.error(error.request);
        } else {
          console.error('Error', error.message);
        }
      });
  },
  get(offset: number) {
    if (offset >= 0) {
      return api()
        .get('clinic?offset=' + offset + '&max=100')
        .then((resp) => {
          console.log(resp);
          clinic.save(resp.data);
          offset = offset + 100;
          if (resp.data.length > 0) {
            setTimeout(this.get, 2);
          }
        })
        .catch((error) => {
          if (error.response) {
            console.error(error.response);
          } else if (error.request) {
            console.error(error.request);
          } else {
            console.error('Error', error.message);
          }
        });
    } else {
      console.error('Error: Request without a valid offset');
    }
  },
  patch(id: number, params: string) {
    return api()
      .patch('clinic/' + id, params)
      .then((resp) => {
        console.log(resp);
        clinic.save(resp.data);
      })
      .catch((error) => {
        if (error.response) {
          console.error(error.response);
        } else if (error.request) {
          console.error(error.request);
        } else {
          console.error('Error', error.message);
        }
      });
  },
  delete(id: number) {
    return api()
      .delete('clinic/' + id)
      .then((resp) => {
        console.log(resp);
        clinic.destroy(id);
      })
      .catch((error) => {
        if (error.response) {
          console.error(error.response);
        } else if (error.request) {
          console.error(error.request);
        } else {
          console.error('Error', error.message);
        }
      });
  },
};
