import { createReducer } from '..'

describe('Utils | Reducer', () => {
  it('creates us a simple reducer function', () => {
    const reducer = createReducer({ namespace: 'app/test' })
    expect(typeof reducer).to.eql('function')
  })

  it('handles FETCH', () => {
    const reducer = createReducer({ namespace: 'app/test' })
    const state = reducer({}, { type: 'app/test/FETCH' })
    expect(state.status).to.eql('fetching')
  })

  it('handles FETCH_SUCCESS', () => {
    const reducer = createReducer({ namespace: 'app/test' })
    const state = reducer(
      {},
      { type: 'app/test/FETCH_SUCCESS', payload: { data: { foo: 'bar' } } }
    )
    expect(state.status).to.eql('fetched')
    expect(state.data.foo).to.eql('bar')
  })

  it('handles FETCH_FAILURE', () => {
    const reducer = createReducer({ namespace: 'app/test' })
    const state = reducer({}, { type: 'app/test/FETCH_FAILURE' })
    expect(state.status).to.eql('failed')
  })

  it('allows you to override FETCH', () => {
    const reducer = createReducer({
      namespace: 'app/test',
      handlers: {
        fetch: (state, payload) => ({
          status: 'custom-handler'
        })
      }
    })
    const state = reducer({}, { type: 'app/test/FETCH' })
    expect(state.status).to.eql('custom-handler')
  })

  it('allows you to override FETCH_SUCCESS', () => {
    const reducer = createReducer({
      namespace: 'app/test',
      handlers: {
        fetchSuccess: (state, payload) => ({
          status: 'custom-handler'
        })
      }
    })
    const state = reducer({}, { type: 'app/test/FETCH_SUCCESS' })
    expect(state.status).to.eql('custom-handler')
  })

  it('allows you to override FETCH_FAILURE', () => {
    const reducer = createReducer({
      namespace: 'app/test',
      handlers: {
        fetchFailure: (state, payload) => ({
          status: 'custom-handler'
        })
      }
    })
    const state = reducer({}, { type: 'app/test/FETCH_FAILURE' })
    expect(state.status).to.eql('custom-handler')
  })

  it('allows you to override the deserializer', () => {
    const reducer = createReducer({
      namespace: 'app/test',
      deserialize: data => ({
        ...data,
        baz: 'qux'
      })
    })
    const state = reducer(
      {},
      { type: 'app/test/FETCH_SUCCESS', payload: { data: { foo: 'bar' } } }
    )
    expect(state.status).to.eql('fetched')
    expect(state.data.foo).to.eql('bar')
    expect(state.data.baz).to.eql('qux')
  })

  it('allows you to override the deserializer when an array of results is returned', () => {
    const reducer = createReducer({
      namespace: 'app/test',
      deserialize: data => ({
        ...data,
        baz: 'qux'
      })
    })
    const state = reducer(
      {},
      {
        type: 'app/test/FETCH_SUCCESS',
        payload: { data: [{ foo: 'bar' }, { quux: 'quuz' }] }
      }
    )
    expect(state.status).to.eql('fetched')
    expect(state.data[0].foo).to.eql('bar')
    expect(state.data[0].baz).to.eql('qux')
    expect(state.data[1].quux).to.eql('quuz')
    expect(state.data[1].baz).to.eql('qux')
  })
})
