import { client } from '../../src/api/clientConfig';
import { filteredOutagesAfterDate, outages, siteInfo, siteOutages } from '../mocks';
import * as fetchSiteInfo from '../../src/api/fetchSiteInfo';
import { OUTAGE_BEGIN_DATE, SITE_ID } from '../../src/constants';
import { postSiteOutage } from '../../src/api/postSiteOutage';
import * as fetchOutages from '../../src/api/fetchOutages';
import * as filterOutagesAfterDate from '../../src/utils/filterOutagesAfterDate';
import * as filterOutagesBySiteDeviceId from '../../src/utils/filterOutagesBySiteDeviceId';

jest.mock('axios', () => {
  return {
    create: jest.fn().mockReturnValueOnce({
      post: jest.fn()
    })
  };
});

beforeEach(() => {
  jest.clearAllMocks();
});

const logSpy = jest.spyOn(global.console, 'log').mockImplementation(() => {});
const fetchOutagesSpy = jest.spyOn(fetchOutages, 'fetchOutages');
const fetchSiteInfoSpy = jest.spyOn(fetchSiteInfo, 'fetchSiteInfo');
const filterOutagesBySiteDeviceIdSpy = jest.spyOn(filterOutagesBySiteDeviceId, 'filterOutagesBySiteDeviceId');
const filterOutagesAfterDateSpy = jest.spyOn(filterOutagesAfterDate, 'filterOutagesAfterDate');

describe('postSiteOutage', () => {
  it('should return 200', async () => {
    (client.post as unknown as jest.Mock).mockReturnValue({
      status: 200
    });

    fetchOutagesSpy.mockResolvedValue(outages);
    fetchSiteInfoSpy.mockResolvedValue(siteInfo);
    filterOutagesAfterDateSpy.mockReturnValue(filteredOutagesAfterDate);
    filterOutagesBySiteDeviceIdSpy.mockReturnValue(siteOutages);

    await expect(postSiteOutage(SITE_ID)).resolves.toEqual({ status: 200 });
    expect(fetchOutagesSpy).toHaveBeenCalled();
    expect(fetchSiteInfoSpy).toHaveBeenCalledWith(SITE_ID);
    expect(filterOutagesAfterDateSpy).toHaveBeenCalledWith(OUTAGE_BEGIN_DATE, outages);
    expect(filterOutagesBySiteDeviceIdSpy).toHaveBeenCalledWith(siteInfo, filteredOutagesAfterDate);
    expect(client.post).toHaveBeenCalledWith(`/site-outages/${SITE_ID}`, siteOutages);
  });

  it('should reject when there are no outages', async () => {
    (client.post as unknown as jest.Mock).mockReturnValue({
      status: 200
    });

    fetchOutagesSpy.mockResolvedValue([]);
    fetchSiteInfoSpy.mockResolvedValue(siteInfo);
    filterOutagesAfterDateSpy.mockReturnValue(filteredOutagesAfterDate);
    filterOutagesBySiteDeviceIdSpy.mockReturnValue(siteOutages);

    await expect(postSiteOutage(SITE_ID)).rejects.toEqual(new Error('No outages or empty site information'));
    expect(fetchOutagesSpy).toHaveBeenCalled();
    expect(fetchSiteInfoSpy).toHaveBeenCalledWith(SITE_ID);
    expect(client.post).not.toHaveBeenCalled();
  });

  it('should reject when there is no site information', async () => {
    (client.post as unknown as jest.Mock).mockReturnValue({
      status: 200
    });

    fetchOutagesSpy.mockResolvedValue(outages);
    fetchSiteInfoSpy.mockResolvedValue(undefined);
    filterOutagesAfterDateSpy.mockReturnValue(filteredOutagesAfterDate);
    filterOutagesBySiteDeviceIdSpy.mockReturnValue(siteOutages);

    await expect(postSiteOutage(SITE_ID)).rejects.toEqual(new Error('No outages or empty site information'));
    expect(fetchOutagesSpy).toHaveBeenCalled();
    expect(fetchSiteInfoSpy).toHaveBeenCalledWith(SITE_ID);
    expect(client.post).not.toHaveBeenCalled();
  });

  it('should log an error', async () => {
    (client.post as unknown as jest.Mock).mockRejectedValue({
      message: 'You do not have the required permissions to make this request.'
    });

    fetchOutagesSpy.mockResolvedValue(outages);
    fetchSiteInfoSpy.mockResolvedValue(siteInfo);
    filterOutagesAfterDateSpy.mockReturnValue(filteredOutagesAfterDate);
    filterOutagesBySiteDeviceIdSpy.mockReturnValue(siteOutages);

    await expect(postSiteOutage(SITE_ID)).resolves.toEqual(undefined);
    expect(fetchOutagesSpy).toHaveBeenCalled();
    expect(fetchSiteInfoSpy).toHaveBeenCalledWith(SITE_ID);
    expect(filterOutagesAfterDateSpy).toHaveBeenCalledWith(OUTAGE_BEGIN_DATE, outages);
    expect(filterOutagesBySiteDeviceIdSpy).toHaveBeenCalledWith(siteInfo, filteredOutagesAfterDate);
    expect(client.post).toHaveBeenCalledWith(`/site-outages/${SITE_ID}`, siteOutages);
    expect(logSpy).toHaveBeenCalledWith('Error', 'You do not have the required permissions to make this request.');
    expect(logSpy).toHaveBeenCalledTimes(2);
  });
});
