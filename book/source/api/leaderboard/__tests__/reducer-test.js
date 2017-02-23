import * as reducers from '../../../utils/reducers'

import { leaderboardReducer } from '..'

describe ('Leaderboard Reducer', () => {
  let createReducer, createReducerSpy

  beforeEach (() => {
    createReducerSpy = sinon.spy()
    createReducer = sinon.stub(reducers, 'createReducer', createReducerSpy)
  })

  afterEach (() => {
    createReducer.restore()
    createReducerSpy.reset()
  })

  it ('should create a reducer with the correct params', () => {
    leaderboardReducer()
    const args = createReducerSpy.firstCall.args[0]
    expect(args.namespace).to.eql('app/leaderboard')
    expect(args.deserialize.name).to.eql('deserializeLeaderboard')
  })

  it ('should allow us to override the action namespace', () => {
    leaderboardReducer({ namespace: 'app/test' })
    const args = createReducerSpy.firstCall.args[0]
    expect(args.namespace).to.eql('app/test')
  })

  it ('should allow us to override the deserializer', () => {
    const myDeserializer = (data) => data
    leaderboardReducer({ deserialize: myDeserializer })
    const args = createReducerSpy.firstCall.args[0]
    expect(args.deserialize.name).to.eql('myDeserializer')
  })

  it ('should allow us to override handlers', () => {
    const myHandler = (data) => data
    leaderboardReducer({ handlers: { fetch: myHandler }})
    const args = createReducerSpy.firstCall.args[0]
    expect(args.handlers.fetch.name).to.eql('myHandler')
  })
})
