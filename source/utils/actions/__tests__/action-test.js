import { createAction } from '..';

describe('Utils | Action Creator', () => {
  let dispatch;
  let spy;

  before(() => {
    // mimic redux-thunk
    dispatch = (action) => {
      spy = sinon.spy();
      return action(spy);
    };
  });

  it('throws if no fetcher is passed in', () => {
    const test = () =>
      createAction({
        namespace: 'app/test',
      });
    expect(test).to.throw;
  });

  it('throws if no namespace is passed in', () => {
    const test = () =>
      createAction({
        fetcher: Promise.resolve({}),
      });
    expect(test).to.throw;
  });

  it('returns a thunk', () => {
    const action = createAction({
      fetcher: Promise.resolve({}),
      namespace: 'app/test',
    });
    expect(typeof action).to.eql('function');
  });

  it('resolves to the fetched data', (done) => {
    dispatch(
      createAction({
        fetcher: Promise.resolve({ foo: 'bar' }),
        namespace: 'app/test',
      })
    ).then((data) => {
      expect(data.foo).to.eql('bar');
      done();
    });
  });

  it('rejects with an error response', (done) => {
    dispatch(
      createAction({
        fetcher: Promise.reject({ status: 404 }),
        namespace: 'app/test',
      })
    ).catch((error) => {
      expect(error.status).to.eql(404);
      done();
    });
  });

  it('dispatches two actions', (done) => {
    dispatch(
      createAction({
        fetcher: Promise.resolve({ foo: 'bar' }),
        namespace: 'app/test',
      })
    ).then(() => {
      expect(spy.callCount).to.eql(2);
      done();
    });
  });

  it('dispatches a fetching action', (done) => {
    dispatch(
      createAction({
        fetcher: Promise.resolve({ foo: 'bar' }),
        namespace: 'app/test',
      })
    ).then((data) => {
      const action = spy.firstCall.args[0];
      expect(action.type).to.eql('app/test/FETCH');
      done();
    });
  });

  it('dispatches a fetched action', (done) => {
    dispatch(
      createAction({
        fetcher: Promise.resolve({ foo: 'bar' }),
        namespace: 'app/test',
      })
    ).then((data) => {
      const action = spy.secondCall.args[0];
      expect(action.type).to.eql('app/test/FETCH_SUCCESS');
      expect(action.payload.data).to.eql({ foo: 'bar' });
      done();
    });
  });

  it('dispatches a failure action', (done) => {
    dispatch(
      createAction({
        fetcher: Promise.reject({ status: 404 }),
        namespace: 'app/test',
      })
    ).catch((error) => {
      const action = spy.secondCall.args[0];
      expect(action.type).to.eql('app/test/FETCH_FAILURE');
      expect(action.payload.error.status).to.eql(404);
      done();
    });
  });

  it('allows an override of the fetch function', (done) => {
    dispatch(
      createAction({
        fetcher: Promise.resolve({ foo: 'bar' }),
        namespace: 'app/test',
        actionDispatchers: {
          fetch: (c, params) => ({
            type: 'test',
          }),
        },
      })
    ).then((data) => {
      const action = spy.firstCall.args[0];
      expect(action.type).to.eql('test');
      done();
    });
  });

  it('allows an override of the fetch success function', (done) => {
    dispatch(
      createAction({
        fetcher: Promise.resolve({ foo: 'bar' }),
        namespace: 'app/test',
        actionDispatchers: {
          fetchSuccess: (c, params) => ({
            type: 'test/success',
          }),
        },
      })
    ).then((data) => {
      const action = spy.secondCall.args[0];
      expect(action.type).to.eql('test/success');
      done();
    });
  });

  it('allows an override of the fetch failure function', (done) => {
    dispatch(
      createAction({
        fetcher: Promise.reject({ status: 404 }),
        namespace: 'app/test',
        actionDispatchers: {
          fetchFailure: (c, params) => ({
            type: 'test/failure',
          }),
        },
      })
    ).catch((error) => {
      const action = spy.secondCall.args[0];
      expect(action.type).to.eql('test/failure');
      done();
    });
  });
});
