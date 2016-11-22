import {combineReducers} from "redux";
import {routerReducer} from "react-router-redux";
import session from "./signin";
import registration from "./registration";
import snippets from "./snippets";
import currentSnippet from "./currentSnippet";
import share from "./share";

export default combineReducers({
    routing: routerReducer,
    session: session,
    registration: registration,
    snippets: snippets,
    currentSnippet: currentSnippet,
    share: share,
});
