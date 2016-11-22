import React, {PropTypes} from "react";
import {connect} from "react-redux";
import {setDocumentTitle} from "../../utils";
import Actions from "../../actions/snippet";
import ShareActions from "../../actions/share";
import RaisedButton from "material-ui/RaisedButton";
import {push} from "react-router-redux";

class SnippetView extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        setDocumentTitle('Snippet');
        const id = this.props.params.id;
        const {dispatch} = this.props;
        if (this.props.currentUser && !this.props.permission && this.props.currentSnippet && (this.props.currentSnippet.owner.username !== this.props.currentUser.username))
            dispatch(ShareActions.getSnippetPermissions(id));
        if (!this.props.currentSnippet || id != this.props.currentSnippet.id) {
            dispatch(Actions.getSnippet(id))
                .then(() => {
                    if (this.props.currentSnippet.owner.username !== this.props.currentUser.username)
                        dispatch(ShareActions.getSnippetPermissions(id))
                });
        }
    }

    render() {
        const {dispatch} = this.props;
        if (this.props.fetched) {
            return (
                <div>
                    <div className="row bottom-xs">
                        <div className="col-sm-6">
                            <h2>
                                Owner: {this.props.currentSnippet.owner.first_name} {this.props.currentSnippet.owner.last_name}</h2>
                        </div>
                        {this.props.currentSnippet.owner.username === this.props.currentUser.username ?
                            <div className="col-sm-6 end-xs">
                                <RaisedButton
                                    onClick={() => dispatch(push("/snippet/" + this.props.params.id + "/edit"))}>Edit</RaisedButton>
                                <RaisedButton
                                    onClick={() => dispatch(push("/snippet/" + this.props.params.id + "/share"))}>Share</RaisedButton>
                                <RaisedButton
                                    onClick={() => dispatch(Actions.deleteSnippet(this.props.params.id))}>Delete</RaisedButton>
                            </div> :
                            null}
                        {this.props.permission === 'change_snippet' ?
                            <div className="col-sm-6 end-xs">
                                <RaisedButton
                                    onClick={() => dispatch(push("/snippet/" + this.props.params.id + "/edit"))}>Edit</RaisedButton>
                            </div> :
                            null}
                    </div>
                    <div className="row" dangerouslySetInnerHTML={{__html: this.props.currentSnippet.html_text}}>
                    </div>
                </div>
            );
        }
        else {
            return null
        }
    }
}
const mapStateToProps = (state) => ({
    fetched: state.currentSnippet.fetched,
    permission: state.currentSnippet.permission,
    currentSnippet: state.currentSnippet.snippet,
    currentUser: state.session.currentUser
});
export default connect(mapStateToProps)(SnippetView);