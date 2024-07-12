import { servicesAPI } from "../../utils/client";
import { required } from "../../utils/params";

export const createQrCode = (
  linkUrl = required(),
  logoUrl = "https://images.justgiving.com/image/justgiving-logo.png"
) => {
  return servicesAPI
    .get("/v1/qrcode/create", { params: { linkUrl, logoUrl } })
    .then(({ data }) => data);
};
