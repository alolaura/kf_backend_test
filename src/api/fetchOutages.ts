import { logError } from '../utils/logError';
import { Outage } from '../types';
import { client } from './clientConfig';

export const fetchOutages = async () => {
  try {
    const res = await client.get<Outage[]>(`/outages`);
    return res.data;
  } catch (error) {
    logError(error);
  }
};
