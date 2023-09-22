import { instance } from '../../../utils/client';
import { createQrCode } from '..';

describe('Create QR Code', () => {
  beforeEach(() => {
    moxios.install(instance);
  });

  afterEach(() => {
    moxios.uninstall(instance);
  });

  it('uses the correct url', (done) => {
    createQrCode('https://link.justgiving.com/v1/fundraisingpage/donate/pageId/1234');

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      expect(request.url).to.include('/v1/qrcodes/create');
      expect(request.url).to.include('1234');
      done();
    });
  });

  it('throws if no url is provided', () => {
    const test = () => createQrCode();
    expect(test).to.throw;
  });
});
