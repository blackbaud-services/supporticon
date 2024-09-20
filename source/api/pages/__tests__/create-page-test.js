import { instance, servicesAPI } from "../../../utils/client";
import { createPage } from "..";

describe("Create Page", () => {
  beforeEach(() => {
    moxios.install(instance);
    moxios.install(servicesAPI);
  });

  afterEach(() => {
    moxios.uninstall(instance);
    moxios.uninstall(servicesAPI);
  });

  it("hits the justgiving api with the correct url and data", (done) => {
    createPage({
      token: "012345abcdef",
      charityId: "1234",
      slug: "super-supporter",
      title: "Super Supporter",
      charityOptIn: true,
    });

    moxios.wait(() => {
      const shortNameRequest = moxios.requests.mostRecent();

      shortNameRequest.respondWith({
        status: 200,
        response: { Names: ["super-supporter-2"] },
      });

      expect(shortNameRequest.url).to.eql(
        "/v1/page/suggest?preferredName=super-supporter"
      );

      moxios.wait(() => {
        const request = moxios.requests.at(1);
        expect(request.url).to.eql("/v1/page");
        expect(request.config.headers["Authorization"]).to.eql(
          "Bearer 012345abcdef"
        );
        expect(JSON.parse(request.config.data).pageShortName).to.eql(
          "super-supporter-2"
        );
        expect(JSON.parse(request.config.data).pageTitle).to.eql(
          "Super Supporter"
        );
        done();
      });
    });
  });

  it("throws if no token is passed", () => {
    const test = () => createPage({ bogus: "data" });
    expect(test).to.throw;
  });

  it("it retries getting the full fundraising page information if the API doesn;t return it for whatever reason", (done) => {
    createPage({
      token: "012345abcdef",
      charityId: "1234",
      slug: "super-supporter",
      title: "Super Supporter",
      charityOptIn: true,
    });

    moxios.wait(() => {
      const shortNameRequest = moxios.requests.mostRecent();
      shortNameRequest.respondWith({
        status: 200,
        response: { Names: ["super-supporter-2"] },
      });

      moxios.wait(() => {
        const createFrpRequest = moxios.requests.at(1);
        createFrpRequest.respondWith({
          status: 200,
          response: { pageId: 12345 },
        });

        moxios.wait(async () => {
          const firstGetPageRequest = moxios.requests.at(2);
          await firstGetPageRequest.respondWith({
            status: 404,
          });

          moxios.wait(async () => {
            const secondGetPageRequests = moxios.requests.at(3);
            expect(secondGetPageRequests.url).to.eql("/v1/page/id/12345");
            await secondGetPageRequests.respondWith({
              status: 500,
            });

            moxios.wait(async () => {
              const thirdGetPageRequests = moxios.requests.at(4);
              expect(thirdGetPageRequests.url).to.eql("/v1/page/id/12345");
              await thirdGetPageRequests.respondWith({
                status: 200,
              });
              done();
            });
          });
        });
      });
    });
  });
});
