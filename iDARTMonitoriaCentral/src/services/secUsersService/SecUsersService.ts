import { useRepo } from 'pinia-orm';
import api from '../apiService/apiService';
import { alert } from '../../components/Shared/Directives/Plugins/Dialog/dialog';
import SecUsers from 'src/stores/models/secUsers/secUsers';

const sec_users = useRepo(SecUsers);

export default {
  // Axios API call
  post(params: string) {
    return api()
      .post('rpc/manage_sec_users', params)
      .then((resp) => {
        if (params.operation_type_user === 'C') {
          const userData = JSON.parse(resp.config.data);
          const userObj = {
            username: userData.username_user,
            pass: userData.pass_user,
            role: userData.role_user,
          };
          //alert(userData);
          sec_users.save(userObj);

          alert(
            'Sucesso!',
            'O Utilizador foi efectuado com sucesso',
            null,
            null,
            null
          );
        } else if (params.operation_type_user === 'U') {
          alert(
            'Sucesso!',
            'O Utilizador foi actualizado com sucesso',
            null,
            null,
            null
          );
        } else if (params.operation_type_user === 'D') {
          sec_users.destroy(params.username_user);
          alert(
            'Sucesso!',
            'O Utilizador foi removido com sucesso',
            null,
            null,
            null
          );
        }
      });
  },
  get(offset: number) {
    if (offset >= 0) {
      return api()
        .get('sec_users?offset=' + offset + '&limit=100')
        .then((resp) => {
          sec_users.save(resp.data);
          offset = offset + 100;
          if (resp.data.length > 0) {
            this.get(offset);
          }
        });
    }
  },
  patch(username: string, params: string) {
    return api()
      .patch('sec_users?username=eq.' + username, params)
      .then((resp) => {
        sec_users.save(JSON.parse(resp.config.data));
        alert(
          'Sucesso!',
          'O Registo foi alterado com sucesso',
          null,
          null,
          null
        );
      });
  },
  delete(id: number) {
    return api()
      .delete('sec_users/' + id)
      .then(() => {
        sec_users.destroy(id);
      });
  },
  // Local Storage Pinia
  newInstanceEntity() {
    return sec_users.getModel().$newInstance();
  },
  getAllSecUsers() {
    return sec_users.all();
  },
  getSecUsersByUserName(username: string) {
    return sec_users.query().where('sec_users', username).get();
  },
};
