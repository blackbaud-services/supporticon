import { instance, servicesAPI } from "../../../utils/client";
import { signIn } from "..";

describe("Authentication | Sign In", () => {
  beforeEach(() => {
    moxios.install(servicesAPI);
    moxios.install(instance);
  });

  afterEach(() => {
    moxios.uninstall(servicesAPI);
    moxios.uninstall(instance);
  });

  it("should hit the JG api with the correct url and data", (done) => {
    signIn({
      authType: "Basic",
      email: "test@gmail.com",
      password: "password",
    });

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      expect(request.url).to.eql("/v1/account");
      done();
    });
  });

  it("should hit the IAM api with the correct url and data", (done) => {
    signIn({
      email: "test@gmail.com",
      password: "password",
      authType: "Bearer",
    });

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      expect(request.url).to.eql("/v1/justgiving/iam/login");
      done();
    });
  });

  it("throws if no password is passed", () => {
    const test = () => signUp({ email: "test@gmail.com", password: "" });
    expect(test).to.throw;
  });

  it("throws if no parameters are provided", () => {
    const test = () => signIn();
    expect(test).to.throw;
  });
});
