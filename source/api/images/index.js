import { imagesAPI, servicesAPI } from "../../utils/client";
import { handleImageFile, isBase64EncodedUrl } from "../../utils/images";
import { required } from "../../utils/params";

export const uploadImage = (image = required()) =>
  handleUploadImage(image)
    .then((response) => response.data.url)
    .then((url) => url && url.replace("http://", "https://"));

const handleUploadImage = (image) => {
  if (typeof image === "string" && !isBase64EncodedUrl(image)) {
    return servicesAPI.post("/v1/justgiving/images", { image });
  }

  return imagesAPI.post("/image", handleImageFile(image), {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
