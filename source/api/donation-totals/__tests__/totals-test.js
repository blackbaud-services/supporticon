import { instance, servicesAPI } from "../../../utils/client";
import { fetchDonationTotals, deserializeDonationTotals } from "..";

describe("Donation Totals", () => {
  describe("Fetch Donation Totals", () => {
    beforeEach(() => {
      moxios.install(instance);
      moxios.install(servicesAPI);
    });

    afterEach(() => {
      moxios.uninstall(instance);
      moxios.uninstall(servicesAPI);
    });

    it("throws if no params are passed in", () => {
      const test = () => fetchDonationTotals();
      expect(test).to.throw;
    });

    it("uses the correct url to fetch totals for an event", (done) => {
      fetchDonationTotals({ event: 12345 });
      moxios.wait(() => {
        const firstRequest = moxios.requests.first();
        const secondRequest = moxios.requests.mostRecent();

        expect(firstRequest.url).to.equal(
          "/v1/justgiving/donations?eventId=12345"
        );

        expect(secondRequest.url).to.equal(
          "/v1/events/leaderboard?eventid=12345&currency=GBP"
        );
        done();
      });
    });

    it("allows the country (and currency) to be specified", (done) => {
      fetchDonationTotals({ event: 12345, country: "ie" });
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        expect(request.url).to.equal(
          "/v1/events/leaderboard?eventid=12345&currency=EUR"
        );
        done();
      });
    });

    it("uses the correct urls to fetch totals for a campaign (with offline amounts)", (done) => {
      fetchDonationTotals({ campaign: "my-campaign", includeOffline: true });
      moxios.wait(() => {
        const firstRequest = moxios.requests.at(0);
        const secondRequest = moxios.requests.at(1);

        expect(firstRequest.url).to.equal(
          "/v1/justgiving/campaigns/my-campaign"
        );
        expect(secondRequest.url).to.equal(
          "/v1/justgiving/campaigns/my-campaign/pages"
        );
        done();
      });
    });

    it("uses the correct url to fetch totals for multiple campaigns", (done) => {
      fetchDonationTotals({ campaign: ["1234", "5678"] });
      moxios.wait(() => {
        const requestUrls = moxios.requests.__items.map(request => request.url)
        expect(requestUrls).to.contain('/v1/justgiving/campaigns/1234')
        expect(requestUrls).to.contain('/v1/justgiving/campaigns/5678')
        done();
      });
    });

    it("uses the correct url to fetch totals for a charity", (done) => {
      fetchDonationTotals({ charity: 1234 }).then((res) => {
        expect(res).to.equal("Charity level reporting has been deprecated");
        done();
      });
    });

    it("uses the correct url to fetch totals for a charity within a campaign", (done) => {
      fetchDonationTotals({ campaign: 1234, charity: 5678 }).then((res) => {
        expect(res).to.equal("Charity level reporting has been deprecated");
        done();
      });
    });
  });

  describe("Deserialize donation totals", () => {
    it("Defaults falsy donation sums to 0", () => {
      const deserializedDonationTotals = deserializeDonationTotals({
        raisedAmount: 0,
      });

      expect(deserializedDonationTotals).to.deep.equal({
        raised: 0,
        offline: 0,
        donations: 0,
      });
    });
  });
});
