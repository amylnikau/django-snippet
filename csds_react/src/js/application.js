import React from "react";
import ReactDOM from "react-dom";
import {browserHistory} from "react-router";
import {syncHistoryWithStore} from "react-router-redux";
import configureStore from "./store";
import Root from "./containers/root";
import injectTapEventPlugin from "react-tap-event-plugin";
import "flexboxgrid/dist/flexboxgrid.css";

injectTapEventPlugin();
const store = configureStore(browserHistory);
const history = syncHistoryWithStore(browserHistory, store);

const target = document.getElementById('main_container');
const node = <Root routerHistory={history} store={store}/>;

ReactDOM.render(node, target);
