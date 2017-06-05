import map from '..'

describe ('Utils | Param Maps', () => {
  it ('performs default mappings', () => {
    const finalParams = map({
      campaign: 'au-1',
      charity: 'au-2',
      group: 'group123'
    })

    expect(Object.keys(finalParams).length).to.eql(3)
    expect(finalParams.campaign_id).to.eql('au-1')
    expect(finalParams.charity_id).to.eql('au-2')
    expect(finalParams.group_value).to.eql('group123')
  })

  it ('keeps unmapped keys', () => {
    const finalParams = map({
      campaign: 'au-1',
      custom: '123'
    })

    expect(Object.keys(finalParams).length).to.eql(2)
    expect(finalParams.campaign_id).to.eql('au-1')
    expect(finalParams.custom).to.eql('123')
  })

  it ('allows us to pass in custom fields', () => {
    const finalParams = map({ campaign: 'au-1' }, {
      mappings: {
        campaign: 'campaignUID'
      }
    })
    expect(Object.keys(finalParams).length).to.eql(1)
    expect(finalParams.campaignUID).to.eql('au-1')
  })

  it ('performs transforms on values', () => {
    const finalParams = map(
      { type: 'team' },
      {
        mappings: { type: 'group_by' },
        transforms: { type: (v) => v === 'team' ? 'teams' : 'individuals' }
      }
    )
    expect(finalParams.group_by).to.eql('teams')
  })
})
