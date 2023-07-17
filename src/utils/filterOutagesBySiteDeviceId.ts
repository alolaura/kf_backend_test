import { EnhancedOutage, Outage, SiteInfo } from '../types';

export const filterOutagesBySiteDeviceId = (site: SiteInfo, outages: Outage[]) => {
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
