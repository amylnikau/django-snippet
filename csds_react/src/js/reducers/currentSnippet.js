import Constants from "../constants";

const initialState = {
    fetched: false,
    snippet: null,
    permission: null,
    error: null
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case Constants.SET_CURRENT_SNIPPET:
            return {
                ...state,
                snippet: action.payload,
                fetched: true,
            };

        case Constants.SET_CURRENT_SNIPPET_PERMISSION:
            return {
                ...state,
                permission: action.payload.permission
            };

        default:
            return state;
    }
}