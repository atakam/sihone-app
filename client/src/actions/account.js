import { ACCOUNT } from './types';

const fetchFromAccount = ({endpoint, options, SUCCESS_TYPE, errorMessage}) => dispatch => {
    dispatch({type: ACCOUNT.FETCH});

    return fetch(`/member/${endpoint}`, options)
      .then(response => response.json())
      .then(json => {
          if (json.type === 'error') {
            dispatch({
                type: ACCOUNT.FETCH_ERROR,
                message: json.message
            });
          }
          else {
              dispatch({
                  type: SUCCESS_TYPE,
                  ...json
              });
          }
      })
      .catch(error => {
        let message = error.message;
        if (error.message.indexOf('Failed to execute') > -1) {
            message = 'Cannot connect to the server. Please contact administrator.';
        } else if (error.message.indexOf('Failed to fetch') > -1) {
            message = 'Cannot connect to the database. Please contact administrator.';
        }
        if (endpoint === 'authenticated') {
            message = '';
        }
        dispatch({
            type: ACCOUNT.FETCH_ERROR, message
        })
      })
}

export const signin = ({email, password}) => fetchFromAccount({
    endpoint: 'login',
    options: {
        method: 'POST',
        body: JSON.stringify({email, password}),
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    },
    SUCCESS_TYPE: ACCOUNT.FETCH_SUCCESS,
    errorMessage: 'Error during login. Check your credentials or contact administrator.'
});

export const logout = () => fetchFromAccount({
    endpoint: 'logout',
    options: {
        credentials: 'include'
    },
    SUCCESS_TYPE: ACCOUNT.FETCH_LOGOUT_SUCCESS,
    errorMessage: 'Error during logout. Contact administrator.'
});

export const fetchAuthenticated = () => fetchFromAccount({
    endpoint: 'authenticated',
    options: {
        credentials: 'include'
    },
    SUCCESS_TYPE: ACCOUNT.FETCH_AUTHENTICATED_SUCCESS,
    errorMessage: ''
});