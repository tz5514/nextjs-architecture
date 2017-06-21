import axios from 'axios'
import isPlainObject from 'lodash/isPlainObject'
import has from 'lodash/has'

axios.defaults.responseType = 'json';

export default function axiosMiddleware({ dispatch, getState }) {
  let cancelSource = {};

  return (next) => async (action) => {
    let {
      actionTypes,
      axiosOptions,
      shouldCall = (state) => true,
      onSuccess = () => {},
      onError = () => {},
      onCancel = () => {},
      payload = {},
      
      axiosCancel
    } = action;

    // Cancel
    if (axiosCancel && axiosCancel.actionType) {
      if (cancelSource[axiosCancel.actionType]) {
        cancelSource[axiosCancel.actionType].cancel(axiosCancel.message || 'manual');
        delete cancelSource[axiosCancel.actionType];
      }
      return;
    }

    if (!axiosOptions || !actionTypes) {
      return next(action);
    }

    if (!shouldCall(getState())) {
      return;
    }
    
    let requestType, successType, errorType, cancelType;
    
    if (Array.isArray(actionTypes)){
      if (actionTypes.length >= 3 && actionTypes.every(type => typeof type === 'string' || typeof type === 'symbol')) {
        [requestType, successType, errorType] = actionTypes;
        if (actionTypes.length >= 4) {
          cancelType = actionTypes[3];
        }
      } else {
        throw new Error('Expected an array contains three string or symbol acionTypes.');
      }
    } else if (isPlainObject(actionTypes)) {
      if (has(actionTypes, 'REQUEST') && has(actionTypes, 'SUCCESS') && has(actionTypes, 'ERROR')) {
        requestType = actionTypes.REQUEST;
        successType = actionTypes.SUCCESS;
        errorType = actionTypes.ERROR;
        if (has(actionTypes, 'CANCEL')) {
          cancelType = actionTypes.CANCEL;
        }
      } else {
        throw new Error('Expected an object contains REQUEST & SUCCESS & ERROR properties.');        
      }
    } else {
      throw new Error('Invaid acionTypes.');
    }
    
    dispatch({ type: requestType, payload });

    let response;
    if (cancelType) {
      cancelSource[cancelType] = axios.CancelToken.source();
      axiosOptions.cancelToken = cancelSource[cancelType].token;
    }

    // transformResponse & transformErrorResponse
    let { transformResponse, transformErrorResponse, ...filteredAxiosOptions } = axiosOptions;
    axiosOptions = filteredAxiosOptions;

    try {
      response = await axios(axiosOptions);
      response.data = (transformResponse) ? transformResponse(response.data) : response.data;

      if (cancelType) {
        delete cancelSource[cancelType];
      }

      dispatch({
        type: successType,
        payload: {
          ...payload,
          data: response.data
        }
      });

      await onSuccess(response.data, dispatch);
      
      return {
        status: 'success',
        isSuccess: true,
        data: response.data
      };

    } catch (error) {
      const errorMessage = error.toString();

      if (cancelType) {
        delete cancelSource[cancelType];
      }

      // Cancel by manual or timeout
      if (errorMessage.includes('Cancel') || errorMessage.includes('timeout of')) {
        dispatch({ 
          type: cancelType,
          payload: {
            ...payload,
            message: error.message
          }
        });
        
        await onCancel(error.message, dispatch);
        
        return {
          status: 'cancel',
          isSuccess: false,
          message: error.message
        }
      }

      let errorPayload;
      if (errorMessage.includes('Error: Request failed with status code')) {
        errorPayload = {
          status: error.response.status,
          statusText: error.response.statusText,
          data: (error.response.data)? (transformErrorResponse) ? transformErrorResponse(error.response.data) : error.response.data : undefined,
        };
      } else if (errorMessage.includes('Network Error')) {
        errorPayload = 'Network Error';
      } else {
        throw new Error(error);
      }

      dispatch({
        type: errorType,
        payload: {
          ...payload,
          error: errorPayload
        }
      });
      
      await onError(errorPayload, dispatch);

      return {
        status: 'error',
        isSuccess: false,
        error: errorPayload,
      };
    }
  };
}

