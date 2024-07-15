import axios from 'axios';
import { API_BASE_URL } from 'config/constant';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL
  // baseURL: 'http://localhost:8000'
});

export default axiosInstance;
