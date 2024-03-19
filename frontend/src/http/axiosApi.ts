import axios from 'axios';
import { BASE_URL } from '../constants/links';

const axiosApi = axios.create({
  baseURL: BASE_URL,
});

export default axiosApi;
