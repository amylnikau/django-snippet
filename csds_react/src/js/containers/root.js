import React, {PropTypes} from "react";
import {Provider} from "react-redux";
import {Router} from "react-router";
import invariant from "invariant";
import configRoutes from "../routes";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

const propTypes = {
    routerHistory: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};

const Root = ({routerHistory, store}) => {
    invariant(
        routerHistory,
        '<Root /> needs either a routingContext or routerHistory to render.'
    );

    return (
        <MuiThemeProvider>
            <Provider store={store}>
                <Router onUpdate={() => window.scrollTo(0, 0)} history={routerHistory}>
                    {configRoutes(store)}
                </Router>
            </Provider>
        </MuiThemeProvider>
    );
};

Root.propTypes = propTypes;
export default Root;
