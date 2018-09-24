export const submitCrossDomainForm = ({
  parent = document.body,
  method = 'POST',
  message,
  action,
  inputs = []
}) => {
  if (typeof window === 'undefined') {
    throw new Error('Must be run in a browser!')
  }

  const frameEl = document.createElement('iframe')
  const formEl = document.createElement('form')
  const formSubmit = document.createElement('button')

  frameEl.width = 0
  frameEl.height = 0
  frameEl.frameBorder = 0
  frameEl.style.position = 'absolute'
  parent.appendChild(frameEl)

  formEl.action = action
  formEl.method = method
  formEl.onsubmit = event =>
    window.parent.postMessage(message, window.location.origin)

  formSubmit.type = 'submit'

  inputs.map(attrs => {
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = attrs.name
    input.value = attrs.value
    return formEl.appendChild(input)
  })

  formEl.appendChild(formSubmit)

  const isDomReady = setInterval(() => {
    const button = frameEl.contentDocument.querySelector('button')

    if (button) {
      clearInterval(isDomReady)
      return button.click()
    } else {
      frameEl.contentDocument.body.appendChild(formEl)
    }
  }, 50)
}
