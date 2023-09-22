import { servicesAPI } from '../../../utils/client';
import { fetchFitnessActivities } from '..';

describe('Fetch Fitness Activities', () => {
  beforeEach(() => {
    moxios.install(servicesAPI);
  });

  afterEach(() => {
    moxios.uninstall(servicesAPI);
  });

  it('throws with incorrect params', () => {
    const test = () => fetchFitnessActivities({ charity: 'charity' });
    expect(test).to.throw;
  });

  it('throws with fetching activities for a campaign', () => {
    const test = () => fetchFitnessActivities({ campaign: '12345678' });
    expect(test).to.throw;
  });

  it('throws with fetching activities for a team', () => {
    const test = () => fetchFitnessActivities({ team: 'test-team' });
    expect(test).to.throw;
  });

  it('fetches activities for a page', (done) => {
    fetchFitnessActivities({ page: 'test-page' });

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      expect(request.url).to.contain('/v1/justgiving/graphql');
      done();
    });
  });
});
