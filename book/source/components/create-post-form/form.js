import * as validators from 'constructicon/lib/validators'

export default ({ post }) => ({
  fields: {
    message: {
      label: 'Post an update',
      type: 'contenteditable',
      validators: [
        (val, { image, video }) => {
          if (!image && !video) {
            return validators.required(
              'Please include a message or an image or video.'
            )(val)
          }
        }
      ]
    },
    image: {
      label: 'Attach an image'
    },
    video: {
      type: 'search',
      label: 'Enter a video URL (e.g. Youtube, Facebook, Vimeo)',
      placeholder: 'e.g. https://www.youtube.com/watch?v=yPw4GHqFV6U',
      autoFocus: true
    }
  }
})
