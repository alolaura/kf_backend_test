import express from 'express';
import axios from 'axios';
import { Outage } from './types/outage';
require('dotenv').config();

const app = express();
const port = 3000;

const kfConfig = {
  headers: {
    'x-api-key': 'process.env.KF_API_KEY'
  }
};

const fetchOutages = async () => {
  try {
    const res = await axios.get<Outage[]>(`${process.env.KF_BASE_URL}/outages`, kfConfig);
    console.log(res.data);
    return res.data;
  } catch (err) {
    if (err instanceof Error) {
      return `${err.message}`;
    }
  }
};

fetchOutages().then((data) => console.log(data));

app.get('/', (req, res) => {
  res.send('hello worlds');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
