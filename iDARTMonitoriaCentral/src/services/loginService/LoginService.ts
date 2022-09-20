import api from '../apiService/apiService';
import { ShowNotification } from '../../components/Shared/Directives/Plugins/Notify/notify';

export const logout = () => {
  return api()
    .get('logout')
    .catch((error) => {
      if (error.response) {
        alert(JSON.stringify(error.response.data));
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log('Error', error.message);
      }
    });
};

export const fetchUsers = () => {
  return api()
    .get('secUser')
    .catch((error) => {
      if (error.response) {
        console.log(error.response);
        alert(error.response.data);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log('Error', error.message);
      }
    });
};

export const signup = (params: string) => {
  return api()
    .post('user/signup', params)
    .catch((error) => {
      if (error.response) {
        console.log(error.response);
        alert(error.response.data);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log('Error', error.message);
      }
    });
};

export const login = (params: string) => {
  return (
    api()
      .post('/rpc/login', params)
      //return Api().post('login', params) //
      .catch((error) => {
        if (error.response) {
          ShowNotification(
            'announcement',
            'Utilizador sem permissão ou Senha inválida ',
            'negative',
            true,
            3000,
            'top',
            'negative',
            'white',
            'glossy'
          );
          console.log(error.response);
        } else if (error.request) {
          console.log(error.request);
        } else {
          ShowNotification(
            'announcement',
            'Problemas ao conectar-se com o Servidor.',
            'negative',
            true,
            3000,
            'top',
            'negative',
            'white',
            'glossy'
          );
          console.log('Error', error.message);
        }
      })
  );
};

export const updateUser = (params: object) => {
  return api()
    .put('secUser/' + params.id, params)
    .catch((error) => {
      if (error.response) {
        console.log(error.response);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log('Error', error.message);
      }
    });
};

export const getUser = (id: number) => {
  return api()
    .get('secUser/' + id)
    .then((resp) => {
      console.log(resp);
    })
    .catch((error) => {
      if (error.response) {
        console.log(error.response);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log('Error', error.message);
      }
    });
};

export const deleteUser = (id: number) => {
  return api()
    .delete('user/' + id)
    .catch((error) => {
      if (error.response) {
        console.log(error.response);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log('Error', error.message);
      }
    });
};
