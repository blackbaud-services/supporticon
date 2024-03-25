import { get } from "../../utils/client";
import { required } from "../../utils/params";

export const createQrCode = (
  linkUrl = required(),
  logoUrl = "https://images.justgiving.com/image/justgiving-logo.png"
) => {
  return get("/v1/qrcodes/create", { linkUrl, logoUrl });
};
