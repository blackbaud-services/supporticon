import * as validators from 'constructicon/lib/validators'

export default () => ({
  fields: {
    team: {
      label: 'Find a team to join',
      validators: [validators.required('Enter your team fundraising target')]
    }
  }
})
