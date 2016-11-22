import {push} from "react-router-redux";
import Constants from "../constants";
import {httpPost, httpGet, httpRequest} from "../utils";

const Actions = {

    updateSnippet: (id, data) => {
        return dispatch => {
            httpRequest('/api/v1/snippet/' + id, 'PATCH', data)
                .then((data) => {
                    dispatch({
                        type: Constants.SET_CURRENT_SNIPPET,
                        payload: data
                    });
                    dispatch(push('/snippet/' + id));
                })
                .catch((error) => {
                    console.log(error.response);
                });
        };
    },

    deleteSnippet: (id) => {
        return dispatch => {
            httpRequest('/api/v1/snippet/' + id, 'DELETE')
                .then(() => {
                    dispatch({
                        type: Constants.DELETE_SNIPPET,
                        payload: id
                    });
                    dispatch(push('/'));
                })
                .catch((error) => {
                    console.log(error);
                    error.response.json()
                        .then((data) => {
                            console.log(data);
                        });
                });
        };
    },

    createSnippet: (data) => {
        return dispatch => {
            httpPost('/api/v1/create_snippet', data)
                .then((data) => {
                    dispatch({
                        type: Constants.ADD_SNIPPET,
                        payload: data
                    });
                    dispatch(push('/'));
                })
                .catch((error) => {
                    error.response.json()
                        .then((data) => {
                            console.log(data);
                        });
                });
        };
    },

    getSnippets: () => {
        return dispatch => {
            httpGet('/api/v1/list_snippets')
                .then((data) => {
                    dispatch({
                        type: Constants.SNIPPETS_RECEIVED,
                        payload: data
                    })
                })
                .catch((error) => {
                    console.log(error);
                });
        };
    },

    getSharedSnippets: () => {
        return dispatch => {
            httpGet('/api/v1/list_shared_snippets')
                .then((data) => {
                    dispatch({
                        type: Constants.SHARED_SNIPPETS_RECEIVED,
                        payload: data
                    })
                })
                .catch((error) => {
                    console.log(error);
                });
        };
    },
    getSnippet: (id) => {
        return dispatch => {
            return httpGet('/api/v1/snippet/' + id)
                .then((data) => {
                    dispatch({
                        type: Constants.SET_CURRENT_SNIPPET,
                        payload: data
                    });
                    return data
                })
                .catch((error) => {
                    console.log(error);
                });
        };
    },
};

export default Actions;
