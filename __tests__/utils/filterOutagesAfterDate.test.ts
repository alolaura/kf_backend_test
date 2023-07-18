import { OUTAGE_BEGIN_DATE } from '../../src/constants';
import { filterOutagesAfterDate } from '../../src/utils/filterOutagesAfterDate';
import { filteredOutagesAfterDate, outages } from '../mocks';

describe('filterOutagesAfterDate', () => {
  it('should return filtered outages after a specific date', () => {
    expect(filterOutagesAfterDate(OUTAGE_BEGIN_DATE, outages)).toEqual(filteredOutagesAfterDate);
  });
});
