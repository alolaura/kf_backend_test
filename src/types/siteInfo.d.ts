export interface SiteInfo {
  id: string;
  name: string;
  devices: Device[];
}

interface Device {
  id: string;
  name: string;
}
