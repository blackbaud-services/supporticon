import { instance, servicesAPI } from "../../../utils/client";
import { createPost } from "..";

describe("Create Post", () => {
  beforeEach(() => {
    moxios.install(instance);
    moxios.install(servicesAPI);
  });

  afterEach(() => {
    moxios.uninstall(instance);
    moxios.uninstall(servicesAPI);
  });

  it("throws if no token is passed", () => {
    const test = () => createPost({ bogus: "data" });
    expect(test).to.throw;
  });

  it("hits the api with the correct url and data", (done) => {
    createPost({
      message: "Test message",
      pageId: "1234-3210-12345",
      userId: "3210-1234-43210",
      token: "test-token",
    });

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      const data = JSON.parse(request.config.data);
      const headers = request.config.headers;

      expect(request.url).to.contain("/v1/justgiving/graphql");
      expect(headers.Authorization).to.equal("Bearer test-token");
      done();
    });
  });
});
