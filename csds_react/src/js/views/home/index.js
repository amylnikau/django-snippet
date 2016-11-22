import React from "react";
import {connect} from "react-redux";
import {setDocumentTitle} from "../../utils";
import Actions from "../../actions/snippet";
import SnippetCard from "../../components/snippet/card";

class HomeIndexView extends React.Component {

    componentDidMount() {
        setDocumentTitle('Home');
        if (!this.props.fetchedOwned) {
            const {dispatch} = this.props;
            dispatch(Actions.getSnippets());
        }
    }


    render() {
        if (this.props.fetchedOwned) {
            return (
                <div>
                    <h2>My snippets</h2>
                    <div className="row">
                        {this.props.ownedSnippets.map((snippet) => {
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
    fetchedOwned: state.snippets.fetchedOwned,
    ownedSnippets: state.snippets.ownedSnippets
});
export default connect(mapStateToProps)(HomeIndexView);
