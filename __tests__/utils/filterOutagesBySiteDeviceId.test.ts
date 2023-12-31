import { filterOutagesBySiteDeviceId } from '../../src/utils/filterOutagesBySiteDeviceId';
import { siteInfo, filteredOutagesAfterDate, siteOutages } from '../mocks';

describe('filterOutagesBySiteDeviceId', () => {
  it('should return filtered outages', () => {
    expect(filterOutagesBySiteDeviceId(siteInfo, filteredOutagesAfterDate)).toEqual(siteOutages);
  });
});
