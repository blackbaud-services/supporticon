import { instance } from '../../../utils/client';
import { updatePage } from '..';

describe('Page | Update Page', () => {
  beforeEach(() => {
    moxios.install(instance);
  });

  afterEach(() => {
    moxios.uninstall(instance);
  });

  it('updates the page story correct url and data', (done) => {
    updatePage('fundraising-page', {
      token: '012345abcdef',
      story: 'My updated story',
    });

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      expect(request.url).to.contain('/v1/fundraising/pages');
      expect(request.url).to.contain('fundraising-page');
      expect(request.config.headers.Authorization).to.eql('Bearer 012345abcdef');
      done();
    });
  });

  it('updates the page summary correct url and data', (done) => {
    updatePage('fundraising-page', {
      token: '012345abcdef',
      summaryWhy: 'Just because giving',
    });

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      expect(request.url).to.contain('/v1/fundraising/pages');
      expect(request.url).to.contain('fundraising-page');
      expect(request.config.headers.Authorization).to.eql('Bearer 012345abcdef');
      done();
    });
  });

  it('updates the multiple page attributes with the correct url and data', (done) => {
    updatePage('page-slug', {
      token: '012345abcdef',
      attribution: 'Jonh Smith',
      story: 'My updated story',
      image: 'https://image.co/photo.jpg',
    });

    moxios.wait(() => {
      const requests = [
        moxios.requests.at(moxios.requests.count() - 3).url,
        moxios.requests.at(moxios.requests.count() - 2).url,
        moxios.requests.at(moxios.requests.count() - 1).url,
      ];

      expect(requests).to.include('/v1/fundraising/pages/page-slug/pagestory');
      expect(requests).to.include('/v1/fundraising/pages/page-slug/attribution');
      expect(requests).to.include('/v1/fundraising/pages/page-slug/images');
      done();
    });
  });

  it('throws if no token is passed', () => {
    const test = () => updatePage('page-slug', { bogus: 'data' });
    expect(test).to.throw;
  });
});
