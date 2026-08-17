import axios from 'axios';
import { API_SUCCESS_CODE } from '../utils/constants';
import { getErrorMessageByCode } from '../utils/errorCodes';
import { getErrorMessage } from '../utils/error';

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

request.interceptors.request.use((config) => {
  const token = localStorage.getItem('civ_event_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

request.interceptors.response.use(
  (response) => {
    const payload = response.data;

    if (payload == null || typeof payload !== 'object') {
      const err = new Error(getErrorMessageByCode(1));
      err.code = 1;
      return Promise.reject(err);
    }

    if (payload.code !== API_SUCCESS_CODE) {
      const err = new Error(getErrorMessageByCode(payload.code, payload.msg));
      err.code = payload.code;
      err.data = payload.data;
      return Promise.reject(err);
    }

    return payload.data;
  },
  (error) => {
    const message = getErrorMessage(error?.response?.data ?? error);
    const err = new Error(message);
    if (error?.response?.data?.code) {
      err.code = error.response.data.code;
    }
    return Promise.reject(err);
  },
);

export default request;
