import { createTeam } from "..";
import { instance, servicesAPI } from "../../../utils/client";

describe("Create a Team", () => {
  beforeEach(() => {
    moxios.install(instance);
    moxios.install(servicesAPI);
  });

  afterEach(() => {
    moxios.uninstall(instance);
    moxios.uninstall(servicesAPI);
  });

  it("throws if no token is passed", () => {
    const test = () => createTeam({ bogus: "data" });
    expect(test).to.throw;
  });

  it("hits the JG api with the correct url and data", (done) => {
    createTeam({
      token: "012345abcdef",
      name: "My JG Test Team",
      story: "Lorem ipsum",
      target: 1000,
      campaignId: "abc123",
      captainSlug: "captain",
    });

    moxios.wait(() => {
      const shortNameRequest = moxios.requests.mostRecent();

      shortNameRequest.respondWith({
        status: 404,
      });

      expect(shortNameRequest.config.baseURL).to.eql(
        "https://api.blackbaud.services"
      );
      expect(shortNameRequest.url).to.contain(
        "/v1/team/my-jg-test-team/suggest"
      );

      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        const data = JSON.parse(request.config.data);

        expect(request.config.baseURL).to.eql("https://api.blackbaud.services");
        expect(request.url).to.contain("/v1/team");
        expect(request.config.headers["Authorization"]).to.eql(
          "Bearer 012345abcdef"
        );
        expect(data.Name).to.eql("My JG Test Team");
        expect(data.TeamShortName).to.eql("my-jg-test-team");
        expect(data.CampaignGuid).to.eql("abc123");
        expect(data.CaptainPageShortName).to.eql("captain");
        expect(data.TeamTarget).to.eql(1000);
        done();
      });
    });
  });
});
