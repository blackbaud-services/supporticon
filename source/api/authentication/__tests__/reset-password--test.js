import { instance, servicesAPI } from '../../../utils/client';
import { resetPassword } from '..';

describe('Authentication | Reset Password', () => {
  beforeEach(() => {
    moxios.install(servicesAPI);
    moxios.install(instance);
  });

  afterEach(() => {
    moxios.uninstall(servicesAPI);
    moxios.uninstall(instance);
  });

  it('sends reset password email using the provided params', (done) => {
    resetPassword({ email: 'test@example.com' });

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      // expect(request.config.baseURL).to.eql('https://api.blackbaud.services')
      expect([
        'https://api.blackbaud.services',
        'https://api-staging.blackbaud.services',
      ]).to.include(request.config.baseURL);
      expect(request.url).to.contain('/v1/justgiving/iam/reset-password');
      expect(JSON.parse(request.config.data).email).to.eql('test@example.com');
      done();
    });
  });

  it('throws if no parameters are provided', () => {
    const test = () => resetPassword();
    expect(test).to.throw;
  });
});
