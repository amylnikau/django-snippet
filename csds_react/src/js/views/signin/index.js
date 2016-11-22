import React from "react";
import {setDocumentTitle} from "../../utils";
import Actions from "../../actions/session";
import Constants from "../../constants";
import {connect} from "react-redux";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import {push} from "react-router-redux";
import {Stepper, Step, StepLabel} from "material-ui/Stepper";
import ReCAPTCHA from "react-google-recaptcha";

const MAX_AUTH_ATTEMPTS = 3;

class SignInView extends React.Component {

    constructor(props) {
        super(props);
        this.recaptchaInstance = null;
        this.state = {
            stepIndex: 0,
            inputUsername: '',
            inputPassword: '',
            inputCode: '',
            inputCaptcha: '',
            isCaptchaValid: true,
        };
        this._updateInputValue = this._updateInputValue.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.errors !== this.props.errors && this.props.authAttempt > MAX_AUTH_ATTEMPTS - 1) {
            this.state.inputCaptcha = '';
            this.recaptchaInstance.reset();
        }
    }

    componentDidMount() {
        setDocumentTitle('Sign in');
    }


    handlePrev = () => {
        const {dispatch, authStep} = this.props;
        if (authStep > 0) {
            dispatch({
                type: Constants.LOGIN_PREV_STEP
            });
        }
    };

    _onCaptchaChange(value) {
        this.setState({
            inputCaptcha: value,
            isCaptchaValid: true
        })
    }

    _handleSubmit(e) {
        e.preventDefault();
        if (this.props.authAttempt < MAX_AUTH_ATTEMPTS || this.state.inputCaptcha) {
            const {dispatch} = this.props;
            switch (this.props.authStep) {
                case 0:
                    dispatch(Actions.signIn(this.state.inputUsername, this.state.inputPassword, this.state.inputCaptcha));
                    break;

                case 1:
                    dispatch(Actions.signInTF(this.state.inputCode));
                    break;

                default:
                    break;
            }
        }
        else if (!this.state.inputCaptcha) {
            this.setState({isCaptchaValid: false})
        }

    }

    _updateInputValue(evt) {
        this.setState({
            [evt.target.id]: evt.target.value
        });
        if (this.props.error) {
            const {dispatch} = this.props;
            dispatch({type: Constants.LOGIN_RESET_ERRORS})
        }
    }

    render() {
        const {dispatch} = this.props;
        const stepIndex = this.props.authStep;

        return (
            <div className="wrapper">
                <form className="form-signin" onSubmit={::this._handleSubmit}>
                    <Stepper activeStep={stepIndex}>
                        <Step>
                            <StepLabel>Enter credentials</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>Enter OTP</StepLabel>
                        </Step>
                    </Stepper>
                    <b style={{color: "red"}}>{this.props.errors.__all__}</b>
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
                                <TextField
                                    required
                                    floatingLabelText="Password"
                                    value={this.state.inputPassword}
                                    id="inputPassword"
                                    fullWidth={true}
                                    onChange={this._updateInputValue}
                                    type="password"
                                />
                            </div>
                            {this.props.authAttempt > MAX_AUTH_ATTEMPTS - 1 ?
                                <div className="row">
                                    <ReCAPTCHA
                                        ref={e => this.recaptchaInstance = e}
                                        sitekey="6LcloAsUAAAAAKc8uwBDkfFKoHcT8jxVQYr_b0MO"
                                        onChange={::this._onCaptchaChange}
                                    />
                                    {!this.state.isCaptchaValid ?
                                        <span style={{color: "red"}}>This field is required</span> : null
                                    }
                                </div> : null}
                        </div> :
                        <div className="row">
                            <TextField
                                required
                                autoFocus
                                floatingLabelText="OTP Code"
                                value={this.state.inputCode}
                                id="inputCode"
                                fullWidth={true}
                                onChange={this._updateInputValue}
                                errorText={this.props.errors.otp}
                            />
                        </div>}
                    <br/>
                    <div className="row">
                        <RaisedButton
                            label="Back"
                            disabled={stepIndex === 0}
                            onTouchTap={this.handlePrev}
                        />
                        <RaisedButton label={stepIndex === 1 ? 'Sign in' : 'Next'}
                                      primary={true} type="submit"
                                      style={{
                                          marginRight: '10px',
                                          marginLeft: '10px'
                                      }}/>
                        {stepIndex === 0 ?
                            <RaisedButton label="Sign up" onClick={() => {
                                dispatch(push('/sign_up'))
                            }}/> : null}
                    </div>
                </form>
            </div>);
    }
}

const mapStateToProps = (state) => ({
    errors: state.session.errors,
    authStep: state.session.authStep,
    authAttempt: state.session.authAttempt
});

export default connect(mapStateToProps)(SignInView);
