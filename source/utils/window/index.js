export const getCurrentUrl = () => {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}${window.location.pathname}`
  }
}

export const getCurrentHref = () => {
  if (typeof window !== 'undefined') {
    return `${window.location.href}`
  }
}

export const getIsMobile = () => {
  if (typeof window !== 'undefined') {
    return navigator.userAgent.match(/Android|iPhone|iPad|iPod/i)
  }
}

export const isFacebookApp = () => {
  if (typeof window !== 'undefined') {
    return navigator.userAgent.match(/FBAV|FBAN/i)
  }
}
