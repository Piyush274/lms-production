import axios from "axios";
import { getHeaderData } from "utils/helpers";
const baseURL = import.meta.env.VITE_API_URL;
export const api = {
  header: () => {
    const header = getHeaderData();
    return header;
  },
  get: (url, header = {}) => {
    let headers = api.header();
    headers = { ...headers, ...header };
    return new Promise((resolve, reject) => {
      axios
        .get(baseURL + url, {
          headers,
        })
        .then((res) => {
          let customResponse = {
            status: res.status,
            data: res?.data || null,
          };
          resolve(customResponse);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  post: (url, data, header = {}) => {
    let headers = api.header();
    headers = { ...headers, ...header };
    return new Promise((resolve, reject) => {
      axios
        .post(baseURL + url, data, {
          headers,
        })
        .then((res) => {
          let customResponse = {
            status: res.status,
            data: res?.data || null,
          };
          resolve(customResponse);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  delete: (url, data, header = {}) => {
    let headers = api.header();
    headers = { ...headers, ...header };
    return new Promise((resolve, reject) => {
      axios
        .delete(import.meta.env.VITE_API_URL + url, {
          headers,
          data,
        })
        .then((res) => {
          let customResponse = {
            status: res.status,
            data: res?.data || null,
          };
          resolve(customResponse);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  put: (url, data, header = {}) => {
    let headers = api.header();
    headers = { ...headers, ...header };
    return new Promise((resolve, reject) => {
      axios
        .put(import.meta.env.VITE_API_URL + url, data, {
          headers,
        })
        .then((res) => {
          let customResponse = {
            status: res.status,
            data: res?.data || null,
          };
          resolve(customResponse);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};
