import Constants from "../constants";
import {httpGet, httpRequest} from "../utils";

const Actions = {

    shareSnippet: (id, data, edit = false) => {
        return dispatch => {
            httpRequest('/api/v1/snippet/' + id + '/share', edit ? 'PATCH' : 'POST', data)
                .then((data) => {
                    console.log(data);
                    dispatch(Actions.getShareInfo(id))
                })
                .catch((error) => {
                    error.response.json()
                        .then((data) => {
                            console.log(data);
                        });
                });
        };
    },

    getShareInfo: (id) => {
        return dispatch => {
            httpGet('/api/v1/snippet/' + id + '/share',)
                .then((data) => {
                    dispatch({
                        type: Constants.SET_SHARE_INFO,
                        payload: data
                    });
                })
                .catch((error) => {
                    console.log(error.response);
                });
        };
    },

    getSnippetPermissions: (id) => {
        return dispatch => {
            httpGet('/api/v1/snippet/' + id + '/share')
                .then((data) => {
                    dispatch({
                        type: Constants.SET_CURRENT_SNIPPET_PERMISSION,
                        payload: data
                    });
                })
                .catch((error) => {
                    console.log(error.response);
                });
        };
    }
};

export default Actions;
