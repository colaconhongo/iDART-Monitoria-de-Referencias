import { useRepo } from 'pinia-orm';
import api from '../apiService/apiService';
import { alert } from '../../components/Shared/Directives/Plugins/Dialog/dialog';
import SecUsers from 'src/stores/models/secUsers/secUsers';
import ProfileService from './ProfileService';
import SecUserProfile from 'src/stores/models/secUsers/secUserProfile';

const sec_users = useRepo(SecUsers);
const userProfileRepo = useRepo(SecUserProfile);

export default {
  // Axios API call
  post(params: string, profileList: []) {
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
          profiles: profileList,
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
          userProfileRepo.where('userid', userObj.userid).delete();
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
          const keysByProfile = this.groupedMap(resp.data, 'userid');
          const secUsersMap = Array.from(keysByProfile.keys());
          secUsersMap.forEach((key) => {
            const secUserProfile = keysByProfile.get(key);
            const secUser = new SecUsers();
            secUser.userid = secUserProfile[0].userid;
            secUser.username = secUserProfile[0].username;
            secUser.nome = secUserProfile[0].nome;
            secUser.apelido = secUserProfile[0].apelido;
            secUser.contacto = secUserProfile[0].contacto;
            secUser.email = secUserProfile[0].email;
            secUser.role = secUserProfile[0].role;
            secUser.pass = secUserProfile[0].pass;
            secUserProfile.forEach((profileUser) => {
              if (profileUser.profile_description !== null) {
                const profile = ProfileService.getFromDescription(
                  profileUser.profile_description
                );
                secUser.profiles.push(profile);
              } else {
                // const profile = ProfileService.getFromDescription('Administrator')
                // secUser.profiles.push(profile)
                secUser.profiles = null;
              }
            });
            sec_users.save(secUser);
          });
          // sec_users.save(resp.data);
          offset = offset + 100;
          if (resp.data.length > 0) {
            this.get(offset);
          }
        });
    }
  },
  patch(params: string) {
    return api()
      .post('rpc/manage_update_sec_users', params)
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
        sec_users.save(userObj);
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
    return sec_users.withAll().get();
  },
  getSecUsersByUserName(username: string) {
    return sec_users.query().withAll().where('username', username).get();
  },
  groupedMap(items, key) {
    return items.reduce(
      (entryMap, e) =>
        entryMap.set(e[key], [...(entryMap.get(e[key]) || []), e]),
      new Map()
    );
  },
};
