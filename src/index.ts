import axios from 'axios';
import { Outage, EnhancedOutage } from './types/outage';
import { SiteInfo } from './types/siteInfo';
require('dotenv').config();

axios.defaults.baseURL = process.env.KF_BASE_URL;
axios.defaults.headers.common['x-api-key'] = process.env.KF_API_KEY;

const outageBeginDate = `2022-01-01T00:00:00.000Z`;
const siteId = 'norwich-pear-tree';

//add to docs
const logError = (error: any) => {
  if (error.response) {
    console.log(error.response.data.message);
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
    const res = await axios.get<Outage[]>(`/outages`);
    return res.data;
  } catch (error) {
    logError(error);
  }
};

const fetchSiteInfo = async (siteId: string) => {
  try {
    const res = await axios.get<SiteInfo>(`/site-info/${siteId}`);
    return res.data;
  } catch (error) {
    logError(error);
  }
};

const filterOutagesAfterDate = (date: string, outages: Outage[]) =>
  outages.filter((outage) => outage.begin >= outageBeginDate);

const filterOutagesBySiteDeviceId = (site: SiteInfo, outages: Outage[]) => {
  return site.devices.reduce<EnhancedOutage[]>((acc, device) => {
    let filteredOutages = outages.filter((outage) => outage.id === device.id);

    if (!filteredOutages.length) return acc;

    filteredOutages.forEach((outage) => {
      acc.push({
        id: device.id,
        name: device.name,
        begin: outage.begin,
        end: outage.end
      });
    });

    return acc;
  }, []);
};

const postSiteOutage = async (siteId: string) => {
  const outages = await fetchOutages();
  const siteInfo = await fetchSiteInfo(siteId);

  if (!outages?.length || !siteInfo) return;

  const filteredOutagesAfterDate = filterOutagesAfterDate(outageBeginDate, outages);
  const filteredOutagesBySite = filterOutagesBySiteDeviceId(siteInfo, filteredOutagesAfterDate);

  try {
    const res = await axios.post<EnhancedOutage[]>(`/site-outages/${siteId}`, filteredOutagesBySite);
    return res;
  } catch (error) {
    logError(error);
  }
};

postSiteOutage(siteId).then((data) => console.log(data?.status));
