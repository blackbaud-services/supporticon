import { servicesAPI } from '../../../utils/client';
import { deleteFitnessActivity } from '..';

describe('Delete Fitness Activity', () => {
  beforeEach(() => {
    moxios.install(servicesAPI);
  });

  afterEach(() => {
    moxios.uninstall(servicesAPI);
  });

  it('throws if no token is passed', () => {
    const test = () => deleteFitnessActivity({ bogus: 'data' });
    expect(test).to.throw;
  });

  it('hits the api with the correct url and data', (done) => {
    deleteFitnessActivity({
      id: '12345678',
      page: 'test-page',
      token: 'test-token',
    });

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      const { headers } = request.config;

      expect(request.url).to.contain('/v1/justgiving/graphql');
      expect(headers.Authorization).to.equal('Bearer test-token');
      done();
    });
  });
});
