export const required = () => {
  throw new Error('Required parameter not supplied')
}

export const dataSource = ({ event, charity, campaign }) => {
  if (event) {
    if (isNaN(event) && isNaN(event.uid)) {
      throw new Error('Event parameter must be an ID')
    }

    return 'event'
  } else if (charity && !campaign) {
    if (isNaN(charity) && isNaN(charity.uid)) {
      throw new Error('Charity parameter must be an ID')
    }

    return 'charity'
  } else if (campaign) {
    return 'campaign'
  } else {
    return required()
  }
}

export const getUID = data => (typeof data === 'object' ? data.uid : data)

export const getShortName = data =>
  typeof data === 'object' ? data.shortName : data
