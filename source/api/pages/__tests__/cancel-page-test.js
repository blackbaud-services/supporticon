import { instance, servicesAPI } from "../../../utils/client";
import { cancelPage } from "..";

describe("Page | Cancel Page", () => {
  beforeEach(() => {
    moxios.install(instance);
    moxios.install(servicesAPI);
  });

  afterEach(() => {
    moxios.uninstall(instance);
    moxios.uninstall(servicesAPI);
  });

  it("makes request to cancel page", (done) => {
    cancelPage({
      slug: "foobar",
      token: "BEARER_TOKEN",
    });

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      expect(request.url).to.contain("/v1/page/foobar");
      expect(request.config.headers["Authorization"]).to.eql(
        "Bearer BEARER_TOKEN"
      );
      done();
    });
  });
});
