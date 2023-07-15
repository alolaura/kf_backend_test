import express from 'express';
import axios from 'axios';
import { Outage } from './types/outage';
import { SiteInfo } from './types/siteInfo';
require('dotenv').config();

const outageBeginDate = `2022-01-01T00:00:00.000Z`;
const siteId = 'norwich-pear-tree';

const app = express();
const port = 3000;

const kfConfig = {
  headers: {
    'x-api-key': process.env.KF_API_KEY
  }
};

//add to docs
const logError = (error: any) => {
  if (error.response) {
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
  } else if (error.request) {
    console.log(error.request);
  } else {
    console.log('Error', error.message);
  }
  console.log(error.config);
};

const fetchOutages = async () => {
  try {
    const res = await axios.get<Outage[]>(`${process.env.KF_BASE_URL}/outages`, kfConfig);
    return res.data;
  } catch (error) {
    logError(error);
  }
};

const fetchSiteInfo = async (siteId: string) => {
  try {
    const res = await axios.get<SiteInfo>(`${process.env.KF_BASE_URL}/site-info/${siteId}`, kfConfig);
    return res.data;
  } catch (error) {
    logError(error);
  }
};

const filterOutagesAfterDate = (date: string, outages: Outage[]) => {
  return outages.filter((outage) => outage.begin > outageBeginDate);
};

const filterOutagesBySiteDeviceId = (site: SiteInfo, outages: Outage[]) => {
  return site.devices.flatMap((device) => {
    let outage = outages.find((outage) => outage.id === device.id);

    if (!outage) return [];

    return {
      id: device.id,
      name: device.name,
      begin: outage.begin,
      end: outage.end
    };
  });
};

const postSiteOutage = async (siteId: string) => {
  const outages = await fetchOutages();
  const siteInfo = await fetchSiteInfo(siteId);

  if (!outages || !siteInfo) return;

  const filteredOutages = filterOutagesAfterDate(outageBeginDate, outages);
  const filteredOutagesBySite = filterOutagesBySiteDeviceId(siteInfo, filteredOutages);
  console.log(filteredOutagesBySite);
};

postSiteOutage(siteId).then();

app.get('/', (req, res) => {
  res.send('hello worlds');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
