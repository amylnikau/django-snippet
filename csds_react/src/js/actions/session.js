import {push} from "react-router-redux";
import Constants from "../constants";
import {httpPost, httpDelete, httpGet} from "../utils";
import {httpRequest} from "../utils/index";

const Actions = {
    loginUserRequest: ()=> {
        return dispatch => {
            dispatch({
                type: Constants.LOGIN_USER_REQUEST,
            });
        };

    },
    setCurrentUser: (user)=> {
        return dispatch => {
            dispatch({
                type: Constants.SET_CURRENT_USER,
                payload: user,
            });
        };

    },

    updateCurrentUser: (data)=> {
        return dispatch => {
            httpRequest('/api/v1/user', 'PUT', data)
                .then((data)=> {
                    dispatch(Actions.setCurrentUser(data));
                })
                .catch((error)=> {
                    console.log(error.response.status)
                })
        }
    },

    getCurrentUser: ()=> {
        return dispatch => {
            httpGet('/api/v1/user')
                .then((data)=> {
                    dispatch(Actions.setCurrentUser(data));
                })
                .catch((error)=> {
                    if (error.response.status === 403) {
                        dispatch(push('/sign_in'))
                    }
                    console.log(error.response.status)
                })
        }
    },

    signIn: (username, password,captcha) => {
        return dispatch => {
            dispatch(Actions.loginUserRequest());
            const data = {
                auth_step: 0,
                username: username,
                password: password,
                captcha: [captcha]
            };

            httpPost('/api/v1/auth', data)
                .then(() => {
                    dispatch({
                        type: Constants.LOGIN_NEXT_STEP,
                    });

                })
                .catch((error) => {
                    error.response.json()
                        .then((errorJSON) => {
                            console.log(errorJSON);
                            dispatch({
                                type: Constants.LOGIN_USER_FAILURE,
                                errors: errorJSON,
                            });
                        });
                });
        };
    },

    signInTF: (otp_code) => {
        return dispatch=> {
            const data = {
                auth_step: 1,
                otp_code: otp_code
            };

            httpPost('/api/v1/auth', data)
                .then((data) => {
                    dispatch(Actions.setCurrentUser(data));
                    dispatch(push('/'));

                })
                .catch((error) => {
                    error.response.json()
                        .then((errorJSON) => {
                            dispatch({
                                type: Constants.LOGIN_USER_FAILURE,
                                errors: errorJSON,
                            });
                        });
                });

        }
    },

    logout: () => {
        return dispatch => {
            httpDelete('/api/v1/auth')
                .then(() => {
                    dispatch({type: Constants.LOGOUT_USER,});

                    dispatch(push('/sign_in'));
                })
                .catch(function (error) {
                    console.log(error);
                });
        };
    },
};

export default Actions;
