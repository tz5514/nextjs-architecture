import { Model, createActionTypes, AJAX_ACTION_TYPES } from 'react-redux-models'

const NEWS_DETAIL = createActionTypes('NEWS_DETAIL', { FETCH: AJAX_ACTION_TYPES });

export default class NewsListModel extends Model {
  actions = {
    fetchNewsDetail: (id) => ({
      axiosOptions: {
        url: `${API_DOMIAN}/api/news/detail/${id}`,
      },
      actionTypes: NEWS_DETAIL.FETCH,
      payload: { id },
      shouldCall: ({ news: { detail }}) => !detail[id] || detail[id].status != 'success'
    }),
  }

  initialState = {}
  
  reducers = {
    [NEWS_DETAIL.FETCH.REQUEST]: (state, { payload }) => ({
      ...state,
      [payload.id]: {
        ...state[payload.id],
        status: 'fetching',
        error: null
      }
    }),

    [NEWS_DETAIL.FETCH.SUCCESS]: (state, { payload }) => ({
      ...state,
      [payload.id]: {
        ...state[payload.id],
        status: 'success',
        data: payload.data,
        error: null
      }
    }),

    [NEWS_DETAIL.FETCH.ERROR]: (state, { payload }) => ({
      ...state,
      [payload.id]: {
        ...state[payload.id],
        status: 'error',
        error: payload.error
      }
    }),
  }
}
