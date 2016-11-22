import Constants from "../constants";

const initialState = {
    fetchedOwned: false,
    fetchedShared: false,
    ownedSnippets: [],
    sharedSnippets: [],
    error: null
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case Constants.SNIPPETS_RECEIVED:
            return {
                ...state,
                fetchedOwned: true,
                ownedSnippets: action.payload,
            };
        case Constants.SHARED_SNIPPETS_RECEIVED:
            return {
                ...state,
                fetchedShared: true,
                sharedSnippets: action.payload,
            };

        case Constants.ADD_SNIPPET:
            return {
                ...state,
                ownedSnippets: [...state.ownedSnippets, action.payload]
            };

        case Constants.DELETE_SNIPPET:
            const index = state.ownedSnippets.findIndex((element) => {
                return element.id == action.payload;
            });
            return {
                ...state,
                ownedSnippets: [
                    ...state.ownedSnippets.slice(0, index),
                    ...state.ownedSnippets.slice(index + 1)
                ]
            };

        default:
            return state;
    }
}