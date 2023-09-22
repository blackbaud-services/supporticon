const removeTags = (string) =>
  string
    .replace(/(<([^>]+)>)/gi, ' ')
    .replace(/ *(\n+) */g, '$1')
    .replace(/ ([,.;:!])/g, '$1')
    .trim();

const removeConsecutiveWhitespace = (string) => string.replace(/\s\s+/g, ' ').trim();

const removeConsecutiveSpaces = (string) => string.replace(/ {2,}/g, ' ').trim();

export const stripTags = (htmlString = '', preserveNewlines = false) =>
  preserveNewlines
    ? removeConsecutiveSpaces(
        removeTags(htmlString.replace(/(<\/[p|h1-6]>)\s*(<[p|h1-6]>)/gim, '$1\n\n$2'))
      )
    : removeConsecutiveWhitespace(removeTags(htmlString));
