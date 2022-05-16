import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://dev.fgh.org.mz:3110',
});

// Request interceptor for API calls
axios.interceptors.request.use(
  async (config) => {
    config.headers = {
      Accept: 'application/json',
    };
    if (
      config.url === '/province' ||
      config.url === '/district' ||
      config.url === '/clinic'
    ) {
      delete config.headers.Authorization;
    } else if (localStorage.getItem('token') != null) {
      config.headers['Bearer'] = ['', localStorage.getItem('token')].join(' ');
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

// Response interceptor for API calls
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    const rToken = localStorage.getItem('refresh_token');
    if (rToken) {
      if (
        (error.response.status === 403 || error.response.status === 401) &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;
        return axios
          .post(
            'http://localhost:408/oauth/access_token?grant_type=refresh_token&refresh_token=' +
              rToken // 'http://localhost:408/oauth/access_token?grant_type=refresh_token&refresh_token=' + rToken
          )
          .then(({ data }) => {
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('refresh_token', data.access_token);
            originalRequest.headers['Bearer'] = [
              '',
              localStorage.getItem('token'),
            ].join(' ');
            return axios(originalRequest);
          });
      }
    }
    return Promise.reject(error);
  }
);

export default () => {
  return instance;
};
