import axios from "axios";

export const createShortLink = (payload) => {
  return axios.post(`${import.meta.env.VITE_REACT_APP_BASE_URL}`, payload);
};

export const getAllLinks  = () => {
  return axios.get(`${import.meta.env.VITE_REACT_APP_BASE_URL}`);
};

export const getStats = (code) => {
  return axios.get(`${import.meta.env.VITE_REACT_APP_BASE_URL}/${code}`);
};

export const getHealth = (url) => {
  return axios.get(`${import.meta.env.VITE_REACT_APP_BASE_URL}/code/healthz?url=${encodeURIComponent(url)}`);
};

export const deleteLink = (code) => {
  return axios.delete(`${import.meta.env.VITE_REACT_APP_BASE_URL}/${code}`);
};
