export const isValidJSON = json => {
  try {
    JSON.parse(json)
    return true
  } catch (error) {
    return false
  }
}

export const parseText = text => {
  const content = text.replace(/\n/g, ' ')

  if (isValidJSON(content)) {
    return JSON.parse(content)[0].nodes[0].ranges[0].text
  }

  return text
}
