import dayjs from 'dayjs';

export default (date) => {
  const isValid = dayjs(date).isValid();
  if (isValid) {
    return dayjs(date).format();
  }
  if (date.indexOf('/Date(') !== -1) {
    // Day.js does not now how to deal with JG formatted UNIX time, so strip out extra parts of string and just serve up digits of UNIX timestamp to convert to ISO
    const prepareStr = Number(date.replace('/Date(', '').replace(')/', '').split('+')[0]);
    const formatUnix = dayjs(prepareStr).format();
    return formatUnix;
  }
};
