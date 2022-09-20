import { useRepo } from 'pinia-orm';
import api from '../apiService/apiService';
import { alert } from '../../components/Shared/Directives/Plugins/Dialog/dialog';
import SecUsers from 'src/stores/models/secUsers/secUsers';

const sec_users = useRepo(SecUsers);

export default {
  // Axios API call
  post(params: string) {
    console.log('Params', params);
    return api()
      .post('rpc/manage_sec_users', params)
      .then((resp) => {
        const userData = JSON.parse(resp.config.data);
        const userObj = {
          username: userData.username_user,
          pass: userData.pass_user,
          role: userData.role_user,
          nome: userData.user_firstname,
          apelido: userData.user_lastname,
          email: userData.user_email,
          userid: userData.user_uuid,
          contacto: userData.user_contact,
        };
        if (params.operation_type_user === 'C') {
          sec_users.save(userObj);
          alert(
            'Sucesso!',
            'O Utilizador foi gravado com sucesso',
            null,
            null,
            null
          );
        } else if (params.operation_type_user === 'U') {
          sec_users.save(userObj);
          alert(
            'Sucesso!',
            'O Utilizador foi actualizado com sucesso',
            null,
            null,
            null
          );
        } else if (params.operation_type_user === 'D') {
          sec_users.destroy(params.uuid);
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
        .get('sec_users_vw?offset=' + offset + '&limit=100')
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
      .patch('sec_users_vw?username=eq.' + username, params)
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
      .delete('sec_users_vw/' + id)
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
    return sec_users.query().where('username', username).get();
  },
};
