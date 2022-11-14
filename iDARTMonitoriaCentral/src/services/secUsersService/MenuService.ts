import { useRepo } from 'pinia-orm';
import Menu from 'src/stores/models/secUsers/menu';
import api from '../apiService/apiService';

const menu = useRepo(Menu);

export default {
  // Axios API call

  get(offset: number) {
    if (offset >= 0) {
      return api()
        .get('menus_vw?offset=' + offset + '&limit=100')
        .then((resp) => {
            menu.save(resp.data);
          offset = offset + 100;
          if (resp.data.length > 0) {
            setTimeout(this.get, 2);
          }
        });
    }
  },
  // Local Storage Pinia
  newInstanceEntity() {
    return menu.getModel().$newInstance();
  },
  getAllFromStorage() {
    return menu.all();
  },
  getFromCode(description: string) {
    return menu.query().where('description', description).first();
  },
};
