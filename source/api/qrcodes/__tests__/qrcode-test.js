import { createQrCode } from "..";
import { instance, servicesAPI } from "../../../utils/client";

describe("Create QR Code", () => {
  beforeEach(() => {
    moxios.install(instance);
    moxios.install(servicesAPI);
  });

  afterEach(() => {
    moxios.uninstall(instance);
    moxios.uninstall(servicesAPI);
  });

  it("uses the correct url", (done) => {
    createQrCode(
      "https://link.justgiving.com/v1/fundraisingpage/donate/pageId/1234"
    );

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      expect(request.url).to.include("/v1/qrcode/create");
      expect(request.url).to.include("1234");
      done();
    });
  });

  it("throws if no url is provided", () => {
    const test = () => createQrCode();
    expect(test).to.throw;
  });
});
