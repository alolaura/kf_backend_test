import { Device } from './Device';

export interface SiteInfo {
  id: string;
  name: string;
  devices: Device[];
}
