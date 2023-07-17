import axios from 'axios';

const client = axios.create({
  baseURL: process.env.KF_BASE_URL,
  headers: {
    'x-api-key': process.env.KF_API_KEY
  }
});

export default client;
