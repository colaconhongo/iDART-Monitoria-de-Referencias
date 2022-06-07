import moment from 'moment';
import api from 'src/services/apiService/apiService';

export default {
  // Axios API call
  getReferedPatientsReport(offset: number) {
    return api()
      .get('refered_patients_vw?offset=' + offset + '&limit=100')
      .then((resp) => {
        return resp.data;
      });
  },

  getFormatDDMMYYYY(date) {
    return moment(date).format('DD-MM-YYYY');
  },
};
