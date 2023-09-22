import { instance, servicesAPI } from '../../../utils/client';
import { createFitnessActivity } from '..';

describe('Create Fitness Activity', () => {
  beforeEach(() => {
    moxios.install(instance);
    moxios.install(servicesAPI);
  });

  afterEach(() => {
    moxios.uninstall(instance);
    moxios.uninstall(servicesAPI);
  });

  it('throws with missing required params', () => {
    const test = () => createFitnessActivity({ distance: 123 });
    expect(test).to.throw;
  });

  describe('hits the JG api with the correct url and data', () => {
    it('using the consumer API', (done) => {
      createFitnessActivity({
        token: '012345abcdef',
        pageSlug: 'my-page',
        caption: 'A walk in the park',
        type: 'run',
        distance: 60,
        useLegacy: true,
      });

      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        expect(request.url).to.contain('/v1/fitness');
        done();
      });
    });

    it('using the GraphQL API', (done) => {
      createFitnessActivity({
        token: '012345abcdef',
        pageId: '00000-123456-1234',
        caption: 'A walk in the park',
        type: 'walk',
        duration: 60,
        userId: '123456-00000-1234',
      });

      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        expect(request.url).to.contain('/v1/justgiving/graphql');
        done();
      });
    });
  });
});
