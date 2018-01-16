import fetchMock from 'fetch-mock';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

import * as actions from '../actions';

describe('getImage', () => {
  afterEach(() => {
    expect(fetchMock.calls().unmatched).toEqual([]);
    fetchMock.restore();
  });

  it('dispatches REQUEST_IMAGE action when getImage is fired', () => {
    fetchMock.get('*', {
      status: 200
    });

    const store = mockStore({
      loading: false,
      data: {
        explanation: '',
        hdurl: '',
        title: ''
      },
      error: null
    });

    const expectedActions = [{ type: 'REQUEST_IMAGE' }];

    store.dispatch(actions.getImage());
    expect(store.getActions()).toEqual(expectedActions);
    expect(fetchMock.called()).toEqual(true);
  });

  it('dispatches SET_IMAGE when data is received', () => {

    fetchMock.get('*', {
      status: 200,
      body: {
        explanation: 'stuff',
        hdurl: 'things',
        title: 'pie'
      }
    });

    const store = mockStore({
      loading: false,
      data: {
        explanation: '',
        hdurl: '',
        title: ''
      },
      error: null
    });

    const expectedActions = [{ type: 'REQUEST_IMAGE' }, { type: 'SET_IMAGE', data: { explanation: 'stuff', hdurl: 'things', title: 'pie' } }];

    store.dispatch(actions.getImage()).then((data) => {
      expect(store.getActions()).toEqual(expectedActions);
    });
    expect(fetchMock.called()).toEqual(true);
  });

  it('dispatches ERROR if the call is unsuccessful', () => {
    fetchMock.get('*', {
      status: 500,
      body: {
        error: {
          code: 'THINGS WENT WRONG',
          message: 'because I said so'
        }
      }
    });

    const store = mockStore({
      loading: false,
      data: {
        explanation: '',
        hdurl: '',
        title: ''
      },
      error: null
    });

    const expectedActions = [{ type: 'REQUEST_IMAGE' }, { type: 'ERROR', error: { code: 'THINGS WENT WRONG', message: 'because I said so' } }];
    store.dispatch(actions.getImage()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });

    expect(fetchMock.called()).toEqual(true);
  });

});
