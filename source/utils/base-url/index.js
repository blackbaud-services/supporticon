let baseURL = 'https://everydayhero.com'

export const update = (newBaseURL) => {
  baseURL = newBaseURL
}

export default () => (baseURL)
