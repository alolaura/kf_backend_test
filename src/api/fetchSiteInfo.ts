import { SiteInfo } from '../types';
import { logError } from '../utils/logError';
import client from './clientConfig';

export const fetchSiteInfo = async (siteId: string) => {
  try {
    const res = await client.get<SiteInfo>(`/site-info/${siteId}`);
    return res.data;
  } catch (error) {
    logError(error);
  }
};
