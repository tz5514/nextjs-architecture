import { Model, createActionTypes } from 'react-redux-models'

export const NOTIFICATION = createActionTypes('NOTIFICATION', 
  ['ADD', 'ADD_DONE', 'REMOVE', 'REMOVE_DONE', 'CLEAR', 'CLEAR_DONE']
);

export default class NotificationModel extends Model {
  initialState = {
    pendingAddItem: null,
    pendingRemoveItemId: null,
    isPendingClear: false 
  }

  actions = {
    addNotification: (options, options2) => {
      if (typeof options == 'string') {
        options = (typeof options2 == 'string')? { 
          level: options,
          message: options2 
        } : {
          ...options2,
          type: options
        };
      }

      return {
        type: NOTIFICATION.ADD,
        payload: { 
          title: '', 
          position: 'br', 
          autoDismiss: 5, 
          level: 'success', 
          ...options
        }
      }
    },

    addNotificationDone: () => ({ type: NOTIFICATION.ADD_DONE }),

    removeNotification: (id) => ({ type: NOTIFICATION.REMOVE, payload: { id } }),
    removeNotificationDone: () => ({ type: NOTIFICATION.REMOVE_DONE }),

    clearNotification: () => ({ type: NOTIFICATION.CLEAR }),
    clearNotificationDone: () => ({ type: NOTIFICATION.CLEAR_DONE }),

    successNotification: (options) => this.actions.addNotification.creator('success', options),
    errorNotification: (options) => this.actions.addNotification.creator('error', options),
    warningNotification: (options) => this.actions.addNotification.creator('warning', options),
    infoNotification: (options) => this.actions.addNotification.creator('info', options),
  }
  
  reducers = {
    // Add
    [NOTIFICATION.ADD]: (notifications, { payload }) => ({
      ...notifications,
      pendingAddItem: payload
    }),

    [NOTIFICATION.ADD_DONE]: (notifications) => ({
      ...notifications,
      pendingAddItem: null
    }),

    // Remove
    [NOTIFICATION.REMOVE]: (notifications, { payload }) => ({
      ...notifications,
      pendingRemoveItemId: payload.id
    }),

    [NOTIFICATION.REMOVE_DONE]: (notifications) => ({
      ...notifications,
      pendingRemoveItemId: null
    }),

    // Clear
    [NOTIFICATION.CLEAR]: (notifications) => ({
      ...notifications,
      isPendingClear: true
    }),

    [NOTIFICATION.CLEAR_DONE]: (notifications) => ({
      ...notifications,
      isPendingClear: false
    }),
  }
}

