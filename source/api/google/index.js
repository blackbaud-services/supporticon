import axios from "axios";
import camelCase from "lodash/camelCase";
import omit from "lodash/omit";
import { required } from "../../utils/client";

const formObj = (keys, values) => {
  const obj = {};
  keys.forEach((item, index) => {
    obj[camelCase(item)] = values[index];
  });
  return obj;
};

export const formatSheet = ({ data }) => {
  const columns = data.values[0];
  const dataRows = data.values.splice(1);
  const rows = dataRows.map((row) => formObj(columns, row));
  return {
    config: omit(data, ["values"]),
    columns,
    rows,
  };
};

// default key is restricted to blackbaud-sites subdomains. If using on custom domain will need to whitelist the domain for the API key in Google Developer console, or pass another key
export const fetchGoogleSheet = ({
  id = required(),
  name = required(),
  key = "AIzaSyCVgB5zhhLPl8LteX8PJ9nHKMduSlDzjS8",
}) =>
  axios
    .get(
      `https://sheets.googleapis.com/v4/spreadsheets/${id}/values/${name}?alt=json&key=${key}`
    )
    .then((response) => formatSheet(response))
    .catch((error) => Promise.reject(error));
