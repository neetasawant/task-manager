import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // change if using deployment URL
});

export default API;