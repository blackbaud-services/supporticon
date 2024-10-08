import { instance, servicesAPI } from "../../../utils/client";
import { fetchPagesTotals } from "..";

describe("Fetch Pages Totals", () => {
  beforeEach(() => {
    moxios.install(instance);
    moxios.install(servicesAPI);
  });

  afterEach(() => {
    moxios.uninstall(instance);
    moxios.uninstall(servicesAPI);
  });

  it("throws if no params are passed in", () => {
    const test = () => fetchPagesTotals();
    expect(test).to.throw;
  });

  it("uses the correct url to fetch totals for an event", (done) => {
    fetchPagesTotals({ event: 12345 });
    moxios.wait(function () {
      const request = moxios.requests.mostRecent();
      expect(request.url).to.equal("/v1/event/12345/total");
      done();
    });
  });

  it("uses the correct url to fetch totals for a campaign", (done) => {
    fetchPagesTotals({ campaign: 12345 });
    moxios.wait(function () {
      const request = moxios.requests.mostRecent();
      expect(request.url).to.include("/v1/justgiving/graphql");
      done();
    });
  });

  it("uses the correct url to fetch totals by tag", (done) => {
    fetchPagesTotals({ tagId: "tag", tagValue: "value" });
    moxios.wait(function () {
      const request = moxios.requests.mostRecent();
      expect(request.url).to.include("v1/pages/tag");
      done();
    });
  });
});
