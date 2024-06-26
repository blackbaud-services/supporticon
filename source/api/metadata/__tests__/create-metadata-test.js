import { metadataAPI } from "../../../utils/client";
import { createMetadata } from "..";

describe("Creating Metadata", () => {
  beforeEach(() => {
    moxios.install(metadataAPI);
  });

  afterEach(() => {
    moxios.uninstall(metadataAPI);
  });

  it("creates metadata with the provided params", (done) => {
    createMetadata({
      app: "123",
      id: "123",
      token: "123",
      metadata: { key: "value" },
    });

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      expect(request.config.baseURL).to.eql(
        "https://metadata.blackbaud.services"
      );
      expect(request.url).to.contain("/v1/apps/123/metadata");
      done();
    });
  });

  it("throws if required params are not supplied", () => {
    const test = () => createMetadata();
    expect(test).to.throw;
  });
});
