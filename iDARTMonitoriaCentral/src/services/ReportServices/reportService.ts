import { useRepo } from 'pinia-orm';
import api from 'src/services/apiService/apiService';
import { alert } from '../../components/Shared/Directives/Plugins/Dialog/dialog';


export default {
  // Axios API call
  get(offset: number) {
      return api()
        .get('patient_last_dispense_vw?offset=' + offset + '&limit=100')
        .then((resp) => {
          return resp.data
        });
  },

};
