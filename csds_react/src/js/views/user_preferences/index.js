import React from "react";
import {setDocumentTitle} from "../../utils";
import Actions from "../../actions/session";
import {connect} from "react-redux";

class UserPreferencesView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            inputUsername: '',
            inputFirstName: '',
            inputLastName: ''
        };
        this._updateInputValue = this._updateInputValue.bind(this)
    }

    componentDidMount() {
        setDocumentTitle('Preferences');
    }

    _handleSubmit(e) {
        e.preventDefault();

        const {dispatch} = this.props;
        dispatch(Actions.updateCurrentUser({
            username: this.state.inputUsername,
            first_name: this.state.inputFirstName,
        }))

    }

    _updateInputValue(evt) {
        this.setState({
            [evt.target.id]: evt.target.value
        });
    }

    render() {
        return (
            <Row>
                <Col sm={6}>
                    <Form>
                        <FormGroup row>
                            <Label for="inputUsername" sm={3}>Username</Label>
                            <Col sm={9}>
                                <Input value={this.state.inputUsername} type="text" id="inputUsername"
                                       required onChange={this._updateInputValue}/>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="inputFirstName" sm={3}>First name</Label>
                            <Col sm={9}>
                                <Input type="text" id="inputFirstName"/>
                            </Col>
                        </FormGroup>
                    </Form>
                </Col>
            </Row>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.session.currentUser,
});

export default connect(mapStateToProps)(UserPreferencesView);