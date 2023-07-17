import axios from 'axios';
import { client } from '../../src/api/clientConfig';
import { fetchOutages } from '../../src/api/fetchOutages';
import { outages } from './mocks';

jest.mock('axios', () => {
  return {
    create: jest.fn().mockReturnValueOnce({
      get: jest.fn()
    })
  };
});

const logSpy = jest.spyOn(global.console, 'log').mockImplementation(() => {});

describe('fetchOutages', () => {
  it.only('should return an array of outages', async () => {
    (client.get as unknown as jest.Mock).mockReturnValue({
      data: outages
    });

    await expect(fetchOutages()).resolves.toEqual(outages);
    expect(client.get).toHaveBeenCalledWith(`/outages`);
  });

  it.only('should log an error', async () => {
    (client.get as unknown as jest.Mock).mockRejectedValue({
      message: 'You do not have the required permissions to make this request.'
    });

    await expect(fetchOutages()).resolves.toEqual(undefined);
    expect(client.get).toHaveBeenCalledWith(`/outages`);
    expect(logSpy).toHaveBeenCalledWith('Error', 'You do not have the required permissions to make this request.');
    expect(logSpy).toHaveBeenCalledTimes(2);
  });
});
