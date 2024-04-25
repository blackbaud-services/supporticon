import { instance } from "../../../utils/client";
import { fetchDonation, replyToDonation } from "..";

describe("Donations", () => {
  beforeEach(() => {
    moxios.install(instance);
  });

  afterEach(() => {
    moxios.uninstall(instance);
  });

  describe("Fetch JG Donation", () => {
    it("uses the correct url to fetch a single donation", (done) => {
      fetchDonation("donation-id");
      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        expect(request.url).to.equal("/v1/donation/donation-id");
        done();
      });
    });

    it("throws if no id is passed in", () => {
      const test = () => fetchDonation();
      expect(test).to.throw;
    });
  });

  describe("Reply to JG Donation", () => {
    it("is not supported", () => {
      const test = () =>
        replyToDonation({
          caption: "Hello",
          donationId: "donation-id",
          pageId: 12345,
          token: "token",
        });

      expect(test).to.throw;
    });
  });
});
