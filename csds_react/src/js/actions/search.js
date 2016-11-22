import {httpGet} from "../utils";

const Actions = {
    searchUser: (searchTerm)=> {
        return dispatch => {
            return httpGet('/api/v1/search/user?searchTerm=' + searchTerm)
        };

    },
};

export default Actions;