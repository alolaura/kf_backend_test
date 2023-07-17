import { OUTAGE_BEGIN_DATE } from '../constants';
import { Outage } from '../types';

export const filterOutagesAfterDate = (date: string, outages: Outage[]) =>
  outages.filter((outage) => outage.begin >= OUTAGE_BEGIN_DATE);
