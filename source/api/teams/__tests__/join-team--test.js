import { joinTeam } from "..";
import { instance, servicesAPI } from "../../../utils/client";

describe("Join a Team", () => {
  beforeEach(() => {
    moxios.install(instance);
    moxios.install(servicesAPI);
  });

  afterEach(() => {
    moxios.uninstall(instance);
    moxios.uninstall(servicesAPI);
  });

  it("throws if no token is passed", () => {
    const test = () => joinTeam({ bogus: "data" });
    expect(test).to.throw;
  });

  it("hits the JG api with the correct url and data", (done) => {
    joinTeam({
      pageId: "4321-9876-xyz4567-1234",
      pageSlug: "my-page",
      teamId: "1234-5436-abc1234-9876",
      teamSlug: "my-team",
      token: "012345abcdef",
    });

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      expect(request.url).to.eql("/v1/justgiving/teams/join");
      expect(request.config.headers["Authorization"]).to.eql(
        "Bearer 012345abcdef"
      );
      done();
    });
  });
});
