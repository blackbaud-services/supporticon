import { instance } from "../../../utils/client";
import { createPageTag } from "..";

describe("Create Page", () => {
  beforeEach(() => {
    moxios.install(instance);
  });

  afterEach(() => {
    moxios.uninstall(instance);
  });

  it("uses the correct url to fetch pages", (done) => {
    createPageTag({
      slug: "my-page",
      label: "State",
      id: "state",
      value: "Queensland",
      aggregation: [
        {
          segment: "page:campaign:1234-5678-abcd-0123",
          measurementDomains: ["all"],
        },
      ],
    });

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      expect(request.url).to.contain("/v1/tags/my-page");
      done();
    });
  });

  it("throws if no slug is passed", () => {
    const test = () => createPageTag({ bogus: "data" });
    expect(test).to.throw;
  });
});
