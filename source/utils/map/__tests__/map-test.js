import map from '..'

describe('Utils | Param Maps', () => {
  it('performs default mappings', () => {
    const finalParams = map({
      campaign: 'f440df6c-1101-4331-ac78-4fc5bc276f4e',
      charity: '12345'
    })

    expect(Object.keys(finalParams).length).to.eql(2)
    expect(finalParams.campaign_id).to.eql(
      'f440df6c-1101-4331-ac78-4fc5bc276f4e'
    )
    expect(finalParams.charity_id).to.eql('12345')
  })

  it('keeps unmapped keys', () => {
    const finalParams = map({
      campaign: 'f440df6c-1101-4331-ac78-4fc5bc276f4e',
      custom: '123'
    })

    expect(Object.keys(finalParams).length).to.eql(2)
    expect(finalParams.campaign_id).to.eql(
      'f440df6c-1101-4331-ac78-4fc5bc276f4e'
    )
    expect(finalParams.custom).to.eql('123')
  })

  it('allows us to pass in custom fields', () => {
    const finalParams = map(
      { campaign: 'f440df6c-1101-4331-ac78-4fc5bc276f4e' },
      {
        mappings: {
          campaign: 'campaignUID'
        }
      }
    )
    expect(Object.keys(finalParams).length).to.eql(1)
    expect(finalParams.campaignUID).to.eql(
      'f440df6c-1101-4331-ac78-4fc5bc276f4e'
    )
  })

  it('performs transforms on values', () => {
    const finalParams = map(
      { type: 'team' },
      {
        mappings: { type: 'group_by' },
        transforms: { type: v => (v === 'team' ? 'teams' : 'individuals') }
      }
    )
    expect(finalParams.group_by).to.eql('teams')
  })
})
