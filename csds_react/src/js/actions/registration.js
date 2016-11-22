import {push} from "react-router-redux";
import Constants from "../constants";
import {httpPost} from "../utils";
import SessionActions from "./session";

const Actions = {

    signUp: (data) => {
        return dispatch => {
            httpPost('/api/v1/register', data)
                .then((data) => {
                    if(Object.keys(data).length === 0){
                        dispatch({
                            type: Constants.REGISTRATION_NEXT_STEP
                        })
                    }
                    else {
                        SessionActions.setCurrentUser(data);
                        dispatch(push('/'));
                    }
                })
                .catch((error) => {
                    console.log(error);
                    error.response.json()
                        .then((errorJSON) => {
                            dispatch({
                                type: Constants.REGISTRATION_FAILURE,
                                payload: errorJSON,
                            });
                        });
                });
        };
    }
};

export default Actions;
