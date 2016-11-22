import Constants from "../constants";

const initialState = {
    fetchedOwned: false,
    allPermissions:[],
    userPermissions: [],
    error: null
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case Constants.SET_SHARE_INFO:
            return {
                ...state,
                allPermissions: action.payload.all_permissions,
                userPermissions: action.payload.user_permissions,
                fetched: true,
            };

        default:
            return state;
    }
}