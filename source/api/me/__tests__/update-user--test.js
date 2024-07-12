import { instance, servicesAPI } from "../../../utils/client";
import { updateCurrentUser } from "..";

describe("Update User", () => {
  beforeEach(() => {
    moxios.install(instance);
    moxios.install(servicesAPI);
  });

  afterEach(() => {
    moxios.uninstall(instance);
    moxios.uninstall(servicesAPI);
  });

  it("throws if no token is passed", () => {
    const test = () => updateCurrentUser({ bogus: "data" });
    expect(test).to.throw;
  });

  it("hits the JG api with the correct url and data", (done) => {
    updateCurrentUser({
      token: "dGVzdEBleGFtcGxlLmNvbTpmb29iYXIxMjM=",
      uuid: "123456-abcdef",
      email: "test@example.com",
      firstName: "Don",
    });

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      expect(request.url).to.contain("/v1/account");
      expect(request.url).to.contain("123456-abcdef");
      done();
    });
  });
});
