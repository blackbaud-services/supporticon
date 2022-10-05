import React from 'react'
import { regularExpressions } from 'constructicon/lib/validators'

import ButtonGroup from 'constructicon/button-group'
import Icon from 'constructicon/icon'
import Section from 'constructicon/section'

const containsSubstring = (valueA, valueB) => {
  if (!valueA || !valueB) return false

  return (
    String(valueA)
      .toLowerCase()
      .indexOf(valueB.toLowerCase()) > -1
  )
}

const PasswordValidations = ({ form }) => {
  const passwordValidations = [
    {
      label: 'Must be at least 12 characters',
      passes: form.values.password.length > 11
    },
    {
      label:
        'Must include at least one number, letter and special character (#,$,%,&,@ etc.)',
      passes: regularExpressions.passwordComplexity.test(form.values.password)
    },
    {
      label: 'Must not include your name or email address',
      passes:
        !containsSubstring(form.values.password, form.values.email) &&
        !containsSubstring(form.values.password, form.values.firstName) &&
        !containsSubstring(form.values.password, form.values.lastName)
    }
  ]

  return (
    <Section spacing={0} margin={{ t: -0.5, b: 0.75 }}>
      {passwordValidations.map((validation, index) => (
        <Section
          foreground={
            validation.passes && form.fields.password.touched
              ? 'success'
              : 'grey'
          }
          key={index}
          spacing={{ y: 0.333 }}
          textAlign='left'
          size={-0.5}
          tag='div'
        >
          <ButtonGroup align='left' spacing={0}>
            <Icon
              name={validation.passes ? 'check' : 'close'}
              color={validation.passes ? 'success' : 'danger'}
            />
            <Section
              spacing={{ l: 0.5 }}
              styles={{ maxWidth: 'calc(100% - 3em)', verticalAlign: 'middle' }}
            >
              {validation.label}
            </Section>
          </ButtonGroup>
        </Section>
      ))}
    </Section>
  )
}

export default PasswordValidations
