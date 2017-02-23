import * as reducers from '../../../utils/reducers'

import { pagesReducer } from '..'

describe ('Pages Reducer', () => {
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
    pagesReducer()
    const args = createReducerSpy.firstCall.args[0]
    expect(args.namespace).to.eql('app/pages')
    expect(args.deserialize.name).to.eql('deserializePage')
  })

  it ('should allow us to override the action namespace', () => {
    pagesReducer({ namespace: 'app/test' })
    const args = createReducerSpy.firstCall.args[0]
    expect(args.namespace).to.eql('app/test')
  })

  it ('should allow us to override the deserializer', () => {
    const myDeserializer = (data) => data
    pagesReducer({ deserialize: myDeserializer })
    const args = createReducerSpy.firstCall.args[0]
    expect(args.deserialize.name).to.eql('myDeserializer')
  })

  it ('should allow us to override handlers', () => {
    const myHandler = (data) => data
    pagesReducer({ handlers: { fetch: myHandler }})
    const args = createReducerSpy.firstCall.args[0]
    expect(args.handlers.fetch.name).to.eql('myHandler')
  })
})
