import * as validators from 'constructicon/lib/validators'

export default ({ post }) => ({
  fields: {
    message: {
      label: 'Post an update',
      type: 'contenteditable',
      placeholder: 'Give everybody an update',
      validators: [validators.required('Please include a message to submit')]
    },
    image: {
      label: 'Attach an image'
    },
    video: {
      type: 'search',
      label: 'Enter a video URL (Youtube, Vimeo, Facebook)',
      placeholder: 'e.g. https://www.youtube.com/watch?v=yPw4GHqFV6U',
      autoFocus: true
    }
  }
})
