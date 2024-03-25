import { fetchFitnessLeaderboard } from "..";
import { instance, servicesAPI } from "../../../utils/client";
import { hash } from "spark-md5";

describe("Fetch Fitness Leaderboards", () => {
  beforeEach(() => {
    moxios.install(instance);
    moxios.install(servicesAPI);
  });

  afterEach(() => {
    moxios.uninstall(instance);
    moxios.uninstall(servicesAPI);
  });

  it("throws if no params are passed in", () => {
    const test = () => fetchFitnessLeaderboard();
    expect(test).to.throw;
  });

  it("uses the correct url to fetch a leaderboard", (done) => {
    fetchFitnessLeaderboard({ campaign: "12345", useLegacy: false });
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      const data = JSON.parse(request.config.data);
      expect(request.url).to.contain("/v1/justgiving/graphql");
      expect(data.query).to.contain(hash("campaign-ad-12345"));
      done();
    });
  });

  it("uses the correct url to fetch a leaderboard for multiple campaigns", (done) => {
    fetchFitnessLeaderboard({ campaign: ["12345", "98765"], useLegacy: true });
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      expect(request.url).to.contain("/v1/fitness/campaign");
      expect(request.url).to.contain("campaignGuid=12345&campaignGuid=98765");
      done();
    });
  });
});
