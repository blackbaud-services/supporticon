import { instance, servicesAPI } from '../../../utils/client';
import { fetchTeam, fetchTeamBySlug, fetchTeams } from '..';

describe('Fetch Teams', () => {
  beforeEach(() => {
    moxios.install(instance);
    moxios.install(servicesAPI);
  });

  afterEach(() => {
    moxios.uninstall(instance);
    moxios.uninstall(servicesAPI);
  });

  describe('Fetch many teams', () => {
    it('uses the correct url to fetch teams', (done) => {
      fetchTeams({ campaign: 'abc123' });
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        expect(request.url).to.contain('/v1/justgiving/graphql');
        done();
      });
    });
  });

  describe('Fetch a single team', () => {
    it('uses the correct url to fetch a single team', (done) => {
      fetchTeam('uuid');
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        expect(request.url).to.eql('/v1/justgiving/graphql');
        done();
      });
    });

    it.skip('uses the correct url to fetch a single team by short name', (done) => {
      fetchTeamBySlug('my-team');
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        expect(request.url).to.contain(
          '/v1/justgiving/proxy/campaigns/v1/teams/by-short-name/my-team/full'
        );
        done();
      });
    });

    it('throws if no params are passed in', () => {
      const test = () => fetchTeam();
      expect(test).to.throw;
    });
  });
});
