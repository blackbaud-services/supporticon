import { instance, servicesAPI } from '../../../utils/client';
import { leaveTeam } from '..';

describe('Leave a Team', () => {
  beforeEach(() => {
    moxios.install(instance);
    moxios.install(servicesAPI);
  });

  afterEach(() => {
    moxios.uninstall(instance);
    moxios.uninstall(servicesAPI);
  });

  it('throws if no token is passed', () => {
    const test = () => leaveTeam({ bogus: 'data' });
    expect(test).to.throw;
  });

  it('hits the Services API with the correct url and data', (done) => {
    leaveTeam({
      pageSlug: 'my-page',
      teamSlug: 'my-team',
      token: '012345abcdef',
    });

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      expect(request.url).to.eql('/v1/justgiving/teams/leave');
      expect(request.config.headers.Authorization).to.eql('Bearer 012345abcdef');
      done();
    });
  });
});
