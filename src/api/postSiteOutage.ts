import { OUTAGE_BEGIN_DATE } from '../constants';
import { EnhancedOutage } from '../types';
import { filterOutagesAfterDate } from '../utils/filterOutagesAfterDate';
import { filterOutagesBySiteDeviceId } from '../utils/filterOutagesBySiteDeviceId';
import { logError } from '../utils/logError';
import { fetchOutages } from './fetchOutages';
import { fetchSiteInfo } from './fetchSiteInfo';
import { client } from './clientConfig';

export const postSiteOutage = async (siteId: string) => {
  const outages = await fetchOutages();
  const siteInfo = await fetchSiteInfo(siteId);

  if (!outages?.length || !siteInfo) throw new Error('No outages or empty site information');

  const filteredOutagesAfterDate = filterOutagesAfterDate(OUTAGE_BEGIN_DATE, outages);
  const filteredOutagesBySite = filterOutagesBySiteDeviceId(siteInfo, filteredOutagesAfterDate);

  try {
    const res = await client.post<EnhancedOutage[]>(`/site-outages/${siteId}`, filteredOutagesBySite);
    return res;
  } catch (error) {
    logError(error);
  }
};
