import { useRepo } from 'pinia-orm';
import StockReport from 'src/stores/models/reportModels/stock/stockReport';
import api from 'src/services/apiService/apiService';
import { alert } from '../../../components/Shared/Directives/Plugins/Dialog/dialog';
import StockReportDetail from 'src/stores/models/reportModels/stock/stockReportDetail';

const stock = useRepo(StockReport);
const stockDetail = useRepo(StockReportDetail);

export default {
  // Axios API call
  get(offset: number) {
    if (offset >= 0) {
      return api()
        .get('stock_clinic_vw?offset=' + offset + '&limit=100')
        .then((resp) => {
          stock.save(resp.data);
          offset = offset + 100;
          if (resp.data.length > 0) {
            setTimeout(this.get, 2);
          }
        })
        .catch((error) => {
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
        });
    }
  },

  getStockClinicSector(offset: number) {
    if (offset >= 0) {
      return api()
        .get('stock_clinic_sector_vw?offset=' + offset + '&limit=100')
        .then((resp) => {
          stock.save(resp.data);
          offset = offset + 100;
          if (resp.data.length > 0) {
            setTimeout(this.get, 2);
          }
        })
        .catch((error) => {
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
        });
    }
  },
  getDetails(drugId: number, clinicId: string) {
    return api()
      .get(`stock_details_vw?drug=eq.${drugId}&clinicid=eq.${clinicId}`)
      .then((resp) => {
        stockDetail.save(resp.data);
      })
      .catch((error) => {
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
      });
  },
  // Local Storage Pinia
  newInstanceEntity() {
    return stock.getModel().$newInstance();
  },
  getAllFromStorage() {
    return stock.all();
  },
  getAllFromStorageByClinicUuid(clinicuuid: string) {
    return stock.where('clinicuuid', clinicuuid).get();
  },
  getAllDetailsOfDrugFromStorage(drugId: number, clinicId: string) {
    return stockDetail.query().where('drug', drugId).get();
  },
  deleteAllFromStorage() {
    stock.flush();
  },
};
