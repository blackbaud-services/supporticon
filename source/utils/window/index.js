export const getCurrentUrl = () => {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}${window.location.pathname}`
  }
}

export const getIsMobile = () => {
  if (typeof window !== 'undefined') {
    return navigator.userAgent.match(/Android|iPhone|iPad|iPod/i)
  }
}
