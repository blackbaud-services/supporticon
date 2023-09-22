import { get, instance, updateClient } from '..';

describe('Utils | get', () => {
  beforeEach(() => {
    moxios.install(instance);
  });

  afterEach(() => {
    moxios.uninstall(instance);
  });

  it('performs a simple get request', (done) => {
    get('/api/v2/campaigns', { foo: 'bar' });
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      expect(request.config.baseURL).to.eql('https://api.justgiving.com');
      expect(request.url).to.contain('/api/v2/campaigns');
      expect(request.url).to.contain('foo=bar');
      expect(request.config.method).to.eql('get');
      done();
    });
  });

  it('resolves to the fetched data', (done) => {
    get('/api/v2/campaigns/f440df6c-1101-4331-ac78-4fc5bc276f4e', {
      foo: 'bar',
    }).then((data) => {
      expect(data.campaign.uid).to.eql('f440df6c-1101-4331-ac78-4fc5bc276f4e');
      expect(data.campaign.name).to.eql('Test Campaign');
      done();
    });

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: {
          campaign: {
            uid: 'f440df6c-1101-4331-ac78-4fc5bc276f4e',
            name: 'Test Campaign',
          },
        },
      });
    });
  });

  it('rejects if the request returns a 404', (done) => {
    get('/api/v2/campaigns/f440df6c-1101-4331-ac78-4fc5bc276f4e', {
      foo: 'bar',
    }).catch((error) => {
      expect(error.status).to.eql(404);
      done();
    });

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 404,
      });
    });
  });

  it('rejects if the request returns a 500', (done) => {
    get('/api/v2/campaigns/f440df6c-1101-4331-ac78-4fc5bc276f4e', {
      foo: 'bar',
    }).catch((error) => {
      expect(error.status).to.eql(500);
      done();
    });

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 500,
      });
    });
  });

  it('throws if no endpoint is supplied', () => {
    const test = () => get();
    expect(test).to.throw;
  });

  it('allows us to update the base url', (done) => {
    updateClient({ baseURL: 'https://api.staging.justgiving.com' });
    get('/api/v2/campaigns', { foo: 'bar' });
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      expect(request.config.baseURL).to.eql('https://api.staging.justgiving.com');
      expect(request.url).to.contain('/api/v2/campaigns');
      updateClient({ baseURL: 'https://api.justgiving.com' });
      done();
    });
  });
});
