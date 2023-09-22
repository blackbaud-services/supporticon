import { instance, servicesAPI } from '../../../utils/client';
import { fetchPage, fetchPageDonationCount, fetchPages, fetchUserPages } from '..';

describe('Fetch Pages', () => {
  beforeEach(() => {
    moxios.install(instance);
    moxios.install(servicesAPI);
  });

  afterEach(() => {
    moxios.uninstall(instance);
    moxios.uninstall(servicesAPI);
  });

  describe('Fetch many pages', () => {
    it('uses the correct url to fetch pages', (done) => {
      fetchPages({ event: 'EVENT_ID' });
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        expect(request.url).to.contain('/v1/onesearch');
        expect(request.url).to.contain('eventId=EVENT_ID');
        done();
      });
    });

    it('uses the correct url to fetch when campaign is supplied', (done) => {
      fetchPages({ campaign: 'UID' });
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        expect(request.url).to.contain('/v1/justgiving/campaigns');
        expect(request.url).to.contain('UID');
        done();
      });
    });

    it('throws if no params are passed in', () => {
      const test = () => fetchPages();
      expect(test).to.throw;
    });
  });

  describe('Fetch a single page', () => {
    it('uses the correct url to fetch a single page', (done) => {
      fetchPage('my-page-shortname');
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        expect(request.url).to.equal('/v1/fundraising/pages/my-page-shortname');
        done();
      });
    });

    it('uses the correct url to fetch a page by slug if optional param is passed', (done) => {
      fetchPage(123, true);
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        expect(request.url).to.equal('/v1/fundraising/pages/123');
        done();
      });
    });

    it('uses an alternate url to fetch a page by id', (done) => {
      fetchPage('123');
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        expect(request.url).to.equal('/v1/fundraising/pagebyid/123');
        done();
      });
    });

    it('fetches pages by event with the correct pageSize', (done) => {
      fetchPages({ event: '123', allPages: true, limit: 50 });
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        expect(request.url).to.contain('/v1/event/123/pages');
        expect(request.url).to.contain('pageSize=50');
        done();
      });
    });

    it('throws if no id is passed in', () => {
      const test = () => fetchPage();
      expect(test).to.throw;
    });
  });

  describe('Fetch a users pages', () => {
    it('uses the correct url to fetch a single page', (done) => {
      fetchUserPages({ token: 'token' });
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        expect(request.url).to.equal('/v1/fundraising/pages');
        done();
      });
    });
  });

  describe('Fetch a single page donation count', () => {
    it('uses the correct url to fetch a donation count', (done) => {
      fetchPageDonationCount('my-page-shortname');

      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        expect(request.url).to.equal('/v1/fundraising/pages/my-page-shortname/donations');
        done();
      });
    });

    it('throws if no id is passed in', () => {
      const test = () => fetchPageDonationCount();
      expect(test).to.throw;
    });
  });
});
