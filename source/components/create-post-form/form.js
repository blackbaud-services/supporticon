import * as validators from 'constructicon/lib/validators'

export default ({ post }) => ({
  fields: {
    message: {
      label: 'Post an update',
      type: 'textarea',
      placeholder: 'Give everybody an update',
      validators: [validators.required('Please include a message to submit')]
    },
    image: {
      label: 'Attach an image'
    }
  }
})
