export const required = () => {
  throw new Error('Required parameter not supplied')
}

export const dataSource = ({ event, charity, campaign }) => {
  if (event) {
    if (isNaN(event)) {
      throw new Error('Event parameter must be an ID')
    }

    return 'event'
  } else if (charity && !campaign) {
    if (isNaN(charity)) {
      throw new Error('Charity parameter must be an ID')
    }

    return 'charity'
  } else {
    if (!charity || !campaign) {
      return required()
    }

    return 'campaign'
  }
}
