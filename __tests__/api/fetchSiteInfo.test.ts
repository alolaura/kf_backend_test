import { client } from '../../src/api/clientConfig';
import { siteInfo } from './mocks';
import { fetchSiteInfo } from '../../src/api/fetchSiteInfo';
import { SITE_ID } from '../../src/constants';

jest.mock('axios', () => {
  return {
    create: jest.fn().mockReturnValueOnce({
      get: jest.fn()
    })
  };
});

const logSpy = jest.spyOn(global.console, 'log').mockImplementation(() => {});

describe('fetchOutages', () => {
  it.only('should return information about a specific site', async () => {
    (client.get as unknown as jest.Mock).mockReturnValue({
      data: siteInfo
    });

    await expect(fetchSiteInfo(SITE_ID)).resolves.toEqual(siteInfo);
    expect(client.get).toHaveBeenCalledWith(`/site-info/${SITE_ID}`);
  });

  it.only('should log an error', async () => {
    (client.get as unknown as jest.Mock).mockRejectedValue({
      message: 'You do not have the required permissions to make this request.'
    });

    await expect(fetchSiteInfo(SITE_ID)).resolves.toEqual(undefined);
    expect(client.get).toHaveBeenCalledWith(`/site-info/${SITE_ID}`);
    expect(logSpy).toHaveBeenCalledWith('Error', 'You do not have the required permissions to make this request.');
    expect(logSpy).toHaveBeenCalledTimes(2);
  });
});
