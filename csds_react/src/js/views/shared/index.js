import React from "react";
import {connect} from "react-redux";
import {setDocumentTitle} from "../../utils";
import Actions from "../../actions/snippet";
import SnippetCard from "../../components/snippet/card";

class SharedWithMeView extends React.Component {

    componentDidMount() {
        setDocumentTitle('Shared with me');
        if (!this.props.fetchedShared) {
            const {dispatch} = this.props;
            dispatch(Actions.getSharedSnippets());
        }
    }


    render() {
        if (this.props.fetchedShared) {
            return (
                <div>
                    <h2>Shared with me</h2>
                    <div className="row">
                        {this.props.sharedSnippets.map((snippet) => {
                            return <div className="col-sm-4" key={snippet.id} style={{marginBottom:'16px'}}>
                                <SnippetCard snippet={snippet}/>
                            </div>
                        })}

                    </div>
                </div>);
        }
        else {
            return null
        }
    }
}
const mapStateToProps = (state) => ({
    fetchedShared: state.snippets.fetchedShared,
    sharedSnippets: state.snippets.sharedSnippets
});
export default connect(mapStateToProps)(SharedWithMeView);
