import 'dotenv/config';
import { postSiteOutage } from './api/postSiteOutage';
import { SITE_ID } from './constants';

(async () => {
  const res = await postSiteOutage(SITE_ID);
  console.log(res?.status, res?.statusText);
})();
