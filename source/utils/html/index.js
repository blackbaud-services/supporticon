export const stripTags = (htmlString = '') =>
  htmlString
    .replace(/(<([^>]+)>)/gi, '')
    .trim('')
    .replace(/\s\s+/g, ' ')
