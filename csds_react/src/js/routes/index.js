import {IndexRoute, Route} from "react-router";
import React from "react";
import MainLayout from "../layouts/main";
import AuthenticatedContainer from "../containers/authenticated";
import HomeIndexView from "../views/home";
import RegistrationView from "../views/registration/index";
import SignInView from "../views/signin/index";
import Actions from "../actions/session";
import UserPreferencesView from "../views/user_preferences";
import EditSnippetView from "../components/snippet/edit_snippet";
import SnippetView from "../components/snippet/snippet";
import ShareView from "../views/share/index";
import SharedWithMeView from "../views/shared/index";
import { browserHistory } from 'react-router'

export default function configRoutes(store) {
    const _ensureAuthenticated = (nextState, replace, callback) => {
        const {dispatch} = store;
        const state = store.getState();
        if (!state.session.currentUser) {
            dispatch(Actions.getCurrentUser());
        }

        callback();
    };

    return (
        <Route component={MainLayout}>
            <Route path="/sign_up" component={RegistrationView}/>
            <Route path="/sign_in" component={SignInView} onEnter={_ensureAuthenticated}/>

            <Route path="/" component={AuthenticatedContainer} onEnter={_ensureAuthenticated}>
                <IndexRoute component={HomeIndexView}/>
                <Route path="shared-with-me" component={SharedWithMeView}/>
                <Route path="account/preferences" component={UserPreferencesView}/>
                <Route path="snippet/new" component={EditSnippetView}/>
                <Route path="snippet/:id" component={SnippetView}/>
                <Route path="snippet/:id/edit" component={EditSnippetView}/>
                <Route path="snippet/:id/share" component={ShareView}/>
            </Route>
        </Route>
    );
}
