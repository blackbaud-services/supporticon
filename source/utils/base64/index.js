export const decodeBase64String = (string) =>
  typeof window === "undefined"
    ? Buffer.from(string, "base64").toString()
    : window.atob(string);

export const encodeBase64String = (string) =>
  typeof window === "undefined"
    ? Buffer.from(string).toString("base64")
    : window.btoa(string);
