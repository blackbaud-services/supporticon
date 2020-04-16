import { isJustGiving } from '../../utils/client'
import * as validators from 'constructicon/lib/validators'

export default () => ({
  fields: {
    name: {
      label: 'Team name',
      placeholder: 'Enter your team name'
    },
    ...(isJustGiving() && {
      target: {
        label: 'Fundraising target',
        placeholder: '1,000',
        validators: [validators.required('Enter your team fundraising target')]
      },
      story: {
        type: 'textarea',
        label: 'Team story',
        validators: [validators.required('Please enter your team story')]
      }
    })
  }
})
