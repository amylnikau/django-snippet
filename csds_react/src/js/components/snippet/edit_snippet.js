import React, {PropTypes} from "react";
import {setDocumentTitle} from "../../utils";
import {connect} from "react-redux";
import Textarea from "react-textarea-autosize";
import Actions from "../../actions/snippet";
import TextField from "material-ui/TextField";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
import RaisedButton from "material-ui/RaisedButton";

class EditSnippetView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputSnippet: 'Test snippet',
            inputLanguage: 'None',
            inputTitle: 'Title'
        };
        this._updateInputValue = this._updateInputValue.bind(this)
    }

    _setCurrentState(id) {
        if (!this.props.currentSnippet || id != this.props.currentSnippet.id) {
            const {dispatch} = this.props;
            dispatch(Actions.getSnippet(id))
                .then((snippet) => {
                    this.setState({
                        inputSnippet: snippet.text,
                        inputLanguage: snippet.language,
                        inputTitle: snippet.title,
                    })
                })
        }
        else {
            this.setState({
                inputSnippet: this.props.currentSnippet.text,
                inputLanguage: this.props.currentSnippet.language,
                inputTitle: this.props.currentSnippet.title,
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.params.id != nextProps.params.id) {
            if (!nextProps.params.id) {
                this.setState({
                    inputSnippet: 'Test snippet',
                    inputLanguage: 'None',
                    inputTitle: 'Title'
                });
            }
            else {
                this._setCurrentState(nextProps.params.id);
            }
        }
    }

    componentDidMount() {
        setDocumentTitle('Edit snippet');
        if (this.props.params.id)
            this._setCurrentState(this.props.params.id);
    }

    _handleSubmit(e) {
        e.preventDefault();

        const {dispatch} = this.props;
        const snippet = {
            text: this.state.inputSnippet,
            language: this.state.inputLanguage,
            title: this.state.inputTitle
        };
        if (this.props.params.id) {
            dispatch(Actions.updateSnippet(this.props.params.id, snippet));
        }
        else {
            dispatch(Actions.createSnippet(snippet));
        }
    }

    _updateInputValue(evt) {
        this.setState({
            [evt.target.id]: evt.target.value
        });
    }

    _updateLanguageValue(evt, key, payload) {
        this.setState({
            inputLanguage: payload
        });
    }

    render() {
        if (!this.props.params.id || this.props.fetched)
            return (
                <form className="form-snippet" onSubmit={::this._handleSubmit}>
                    <h2>{this.props.params.id ? "Edit snippet" : "New snippet"}</h2>

                    <Textarea rows={8} className="snippet-area" value={this.state.inputSnippet} type="textarea"
                              id="inputSnippet" required onChange={this._updateInputValue}/>
                    <div className="col-sm-4">
                        <div className="row">
                            <SelectField
                                floatingLabelText="Language"
                                id="inputLanguage"
                                fullWidth={true}
                                value={this.state.inputLanguage}
                                onChange={::this._updateLanguageValue}
                            >
                                <MenuItem value="None" primaryText="None"/>
                                <MenuItem value="Python" primaryText="Python"/>
                            </SelectField>
                        </div>
                        <div className="row">
                            <TextField
                                floatingLabelText="Title"
                                value={this.state.inputTitle}
                                id="inputTitle"
                                fullWidth={true}
                                onChange={this._updateInputValue}
                            />
                        </div>
                        <div className="row end-xs">
                            <RaisedButton label="Save" primary={true} type="submit"/>
                        </div>
                    </div>

                </form>
            );
        else
            return null;
    }
}

const mapStateToProps = (state) => ({
    fetched: state.currentSnippet.fetched,
    currentSnippet: state.currentSnippet.snippet
});

export default connect(mapStateToProps)(EditSnippetView);