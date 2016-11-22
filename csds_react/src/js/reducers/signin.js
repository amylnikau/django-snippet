import Constants from "../constants";

const initialState = {
    currentUser: null,
    isAuthenticating: false,
    isAuthenticated: false,
    authStep: 0,
    authAttempt: 0,
    errors: {}
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case Constants.LOGIN_USER_REQUEST:
            return {
                ...state,
                isAuthenticating: true,
                errors: {}
            };
        case Constants.SET_CURRENT_USER:
            return {
                ...state,
                authAttempt: 0,
                isAuthenticating: false,
                isAuthenticated: true,
                currentUser: action.payload,
                errors: {}
            };

        case Constants.LOGIN_NEXT_STEP:
            return {
                ...state,
                authStep: state.authStep + 1,
                authAttempt: 0
            };
        case Constants.LOGIN_PREV_STEP:
            return {
                ...state,
                authStep: state.authStep - 1,
                authAttempt: 0
            };

        case Constants.LOGIN_RESET_ERRORS:
            return {
                ...state,
                errors: {}
            };

        case Constants.LOGOUT_USER:
            return initialState;

        case Constants.LOGIN_USER_FAILURE:
            return {
                ...state,
                authAttempt: state.authAttempt + 1,
                errors: action.errors
            };

        default:
            return state;
    }
}
