import { Model, createActionTypes, AJAX_ACTION_TYPES } from 'react-redux-models'

const NEWS_LIST = createActionTypes('NEWS_LIST', { FETCH: [AJAX_ACTION_TYPES, 'END'] });

export default class NewsListModel extends Model {
  static importActions = {
    NotificationModel: ['successNotification'],
  }

  actions = {
    fetchNewsList: (page) => ({
      axiosOptions: {
        url: `${API_DOMIAN}/api/news/list/${page}`,
      },
      actionTypes: NEWS_LIST.FETCH,
      payload: { page },
      shouldCall: (state) => state.news.list.status != 'end',
      onSuccess: (data) => {
        this.actions.successNotification(`Page ${page} loaded.`); 

        if (Array.isArray(data) && data.length == 0) {
          this.actions.fetchNewListEnd();
        }
      },
    }),

    fetchNewListEnd: () => ({ type: NEWS_LIST.FETCH.END })
  }

  initialState = {
    status: null, page: 0, data: [], scrollTop: 0, error: null
  }
  
  reducers = {
    [NEWS_LIST.FETCH.REQUEST]: (state) => ({
      ...state,
      status: 'request',
      error: null
    }),

    [NEWS_LIST.FETCH.SUCCESS]: (state, { payload }) => ({
      ...state,          
      status: 'success',
      page: payload.page,
      data: state.data.concat(payload.data),
      error: null
    }),

    [NEWS_LIST.FETCH.ERROR]: (state, { payload }) => ({
      ...state,
      status: 'error',
      error: payload.error
    }),

    [NEWS_LIST.FETCH.END]: (state) => ({
      ...state,
      status: 'end',
    })
  }

  computedValues = {
    nextListPage: {
      selectors: [(state) => state.news.list.page],
      compute: (page) => page + 1
    }
  }
}
