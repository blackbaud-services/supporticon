import { instance } from '../../../utils/client';
import { fetchCurrentUser } from '..';

describe('Fetch User', () => {
  beforeEach(() => {
    moxios.install(instance);
  });

  afterEach(() => {
    moxios.uninstall(instance);
  });

  it('throws if no token is passed', () => {
    const test = () => fetchCurrentUser({ bogus: 'data' });
    expect(test).to.throw;
  });

  it('hits the JG api with the correct url and data', (done) => {
    fetchCurrentUser({ token: 'dGVzdEBleGFtcGxlLmNvbTpmb29iYXIxMjM=' });

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      expect(request.url).to.contain('/v1/account');
      expect(request.config.headers.Authorization).to.eql(
        'Bearer dGVzdEBleGFtcGxlLmNvbTpmb29iYXIxMjM='
      );
      done();
    });
  });
});
