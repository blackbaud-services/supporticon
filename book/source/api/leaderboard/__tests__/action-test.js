import * as actions from '../../../utils/actions'
import { fetchLeaderboardAction } from '..'

describe ('Fetch Leaderboards Action Creator', () => {
  let createAction, createActionSpy

  beforeEach (() => {
    createActionSpy = sinon.spy()
    createAction = sinon.stub(actions, 'createAction', createActionSpy)
  })

  afterEach (() => {
    createAction.restore()
    createActionSpy.reset()
  })

  it ('should create an action with the correct params', () => {
    fetchLeaderboardAction({ campaign: 'au-6839' })
    const args = createActionSpy.firstCall.args[0]
    expect(args.fetcher.name).to.eql('fetchLeaderboard')
    expect(args.params).to.eql({ campaign: 'au-6839' })
    expect(args.namespace).to.eql('app/leaderboard')
    expect(args.options).to.eql({})
  })

  it ('should allow us to override the action namespace', () => {
    fetchLeaderboardAction({ campaign: 'au-6839' }, { namespace: 'app/test' })
    const args = createActionSpy.firstCall.args[0]
    expect(args.namespace).to.eql('app/test')
  })

  it ('should allow us to override actions', () => {
    fetchLeaderboardAction({ campaign: 'au-6839' }, { fetch: 'my-fetch-action' })
    const args = createActionSpy.firstCall.args[0]
    expect(args.options.fetch).to.eql('my-fetch-action')
  })
})
