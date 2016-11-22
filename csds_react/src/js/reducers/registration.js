import Constants from "../constants";

const initialState = {
    registerStep: 0,
    errors: null,
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case Constants.REGISTRATION_NEXT_STEP:
            return {
                ...state,
                registerStep: state.registerStep + 1
            };

        case Constants.REGISTRATION_PREV_STEP:
            return {
                ...state,
                registerStep: state.registerStep - 1
            };

        case Constants.REGISTRATION_RESET_ERRORS:
            return {
                ...state,
                errors: null
            };

        case Constants.REGISTRATION_FAILURE:
            return {
                ...state,
                errors: action.payload
            };

        default:
            return state;
    }
}
