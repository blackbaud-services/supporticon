import { instance } from '../../../utils/client';
import { fetchEvent } from '..';

describe('Fetch Event', () => {
  beforeEach(() => {
    return moxios.install(instance);
  });

  afterEach(() => {
    moxios.uninstall(instance);
  });

  it('throws if event is requested', () => {
    const test = () => fetchEvent({ id: '12345' });
    expect(test).to.throw;
  });

  it('fetches a single event', (done) => {
    fetchEvent({ id: '12345' });
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      expect(request.url).to.equal('/v1/event/12345');
      done();
    });
  });

  it('throws with incorrect params', () => {
    const test = () => fetchEvent({ charity: 'charity' });
    expect(test).to.throw;
  });

  it('throws if a event is requested, but no id is supplied', () => {
    const test = () => fetchEvent();
    expect(test).to.throw;
  });
});
