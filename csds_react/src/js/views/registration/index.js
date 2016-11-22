import React, {PropTypes} from "react";
import {connect} from "react-redux";
import {setDocumentTitle} from "../../utils";
import Constants from "../../constants";
import Actions from "../../actions/registration";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import {push} from "react-router-redux";
import {Stepper, Step, StepLabel} from "material-ui/Stepper";

class RegistrationView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputUsername: 'andrew',
            inputPassword: 'andrew',
            inputFirstName: 'Andrew',
            inputLastName: 'Mylnikov',
            inputEmail: 'andrew@example.com',
            inputCode: ''
        };
        this._updateInputValue = this._updateInputValue.bind(this)
    }

    handlePrev = () => {
        const {dispatch, registerStep} = this.props;
        if (registerStep > 0) {
            dispatch({
                type: Constants.REGISTRATION_PREV_STEP
            });
        }
    };

    componentDidMount() {
        setDocumentTitle('Sign up');
    }

    _handleSubmit(e) {
        e.preventDefault();

        const {dispatch} = this.props;
        if (this.props.registerStep === 0) {
            dispatch(Actions.signUp({
                register_step: 0,
                username: this.state.inputUsername,
                password: this.state.inputPassword,
                first_name: this.state.inputFirstName,
                last_name: this.state.inputLastName,
                email: this.state.inputEmail
            }))
        }
        else {
            dispatch(Actions.signUp({
                register_step: 1,
                otp_code: this.state.inputCode
            }))
        }
    }

    _updateInputValue(evt) {
        this.setState({
            [evt.target.id]: evt.target.value
        });
        if (this.props.errors) {
            const {dispatch} = this.props;
            dispatch({type: Constants.REGISTRATION_RESET_ERRORS})
        }
    }

    render() {
        const {dispatch} = this.props;
        const stepIndex = this.props.registerStep;

        return (
            <form className="form-signin" onSubmit={::this._handleSubmit}>
                <Stepper activeStep={stepIndex}>
                    <Step>
                        <StepLabel>Fill in the personal data</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel>Setup second factor</StepLabel>
                    </Step>
                </Stepper>
                {stepIndex === 0 ?
                    <div>
                        <div className="row">
                            <TextField
                                required
                                autoFocus
                                floatingLabelText="Username"
                                value={this.state.inputUsername}
                                id="inputUsername"
                                fullWidth={true}
                                onChange={this._updateInputValue}
                            />
                        </div>
                        <div className="row">
                            <div className="col-sm-6" style={{paddingLeft: 0}}>
                                <TextField
                                    required
                                    floatingLabelText="First name"
                                    value={this.state.inputFirstName}
                                    id="inputFirstName"
                                    fullWidth={true}
                                    onChange={this._updateInputValue}
                                />
                            </div>
                            <div className="col-sm-6" style={{paddingRight: 0}}>
                                <TextField
                                    required
                                    floatingLabelText="Last name"
                                    value={this.state.inputLastName}
                                    id="inputLastName"
                                    fullWidth={true}
                                    onChange={this._updateInputValue}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <TextField
                                required
                                floatingLabelText="Email"
                                value={this.state.inputEmail}
                                id="inputEmail"
                                type="email"
                                fullWidth={true}
                                onChange={this._updateInputValue}
                            />
                        </div>
                        <div className="row">
                            <TextField
                                required
                                floatingLabelText="Password"
                                value={this.state.inputPassword}
                                id="inputPassword"
                                type="password"
                                fullWidth={true}
                                onChange={this._updateInputValue}
                            />
                        </div>
                    </div> :
                    <div>
                        <p>Scan barcode with Google Authenticator (or similar app)</p>
                        <img src="/totp_qrcode"/>
                        <div className="row">
                            <TextField
                                required
                                autoFocus
                                floatingLabelText="OTP Code"
                                value={this.state.inputCode}
                                id="inputCode"
                                fullWidth={true}
                                onChange={this._updateInputValue}
                                errorText={this.props.error}
                            />
                        </div>
                    </div>}
                <br/>
                <div className="row">
                    <RaisedButton
                        label="Back"
                        disabled={stepIndex === 0}
                        onTouchTap={this.handlePrev}
                    />
                    <RaisedButton label={stepIndex === 1 ? 'Sign up' : 'Next'}
                                  primary={true} type="submit"
                                  style={{
                                      marginRight: '10px',
                                      marginLeft: '10px'
                                  }}/>
                    {stepIndex === 0 ?
                        <RaisedButton label="Sign in" onClick={()=> {
                            dispatch(push('/sign_in'))
                        }}/> : null}
                </div>
            </form>);
    }
}

const mapStateToProps = (state) => ({
    errors: state.registration.errors,
    registerStep: state.registration.registerStep,
});

export default connect(mapStateToProps)(RegistrationView);
