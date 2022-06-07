import { useRepo } from 'pinia-orm';
import api from 'src/services/apiService/apiService';
import { alert } from '../../components/Shared/Directives/Plugins/Dialog/dialog';


export default {
  // Axios API call
  getReferedPatientsReport(offset: number) {
      return api()
        .get('refered_patients_vw?offset=' + offset + '&limit=100')
        .then((resp) => {
          console.log(resp.data)
          return resp.data
        });
  },

};
