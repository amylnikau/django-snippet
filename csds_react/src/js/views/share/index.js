import React from "react";
import {setDocumentTitle} from "../../utils";
import Actions from "../../actions/share";
import {connect} from "react-redux";
import RaisedButton from "material-ui/RaisedButton";
import {List, ListItem} from "material-ui/List";
import Chip from "material-ui/Chip";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
import AutoComplete from "material-ui/AutoComplete";
import SearchActions from "../../actions/search";
import TextField from "material-ui/TextField";

class ShareView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            edit: false,
            inputPermission: 'view_codesnippet',
            userIndex: -1,
            users: [],
            dataUserSource: [],
            inputCode: ''
        };
    }

    handleUpdateUser = (value) => {
        const {dispatch} = this.props;
        if (value.length % 2 === 0)
            dispatch(SearchActions.searchUser(value))
                .then((data) => {
                    console.log(data);
                    this.setState({
                        users: data,
                        dataUserSource: data.map((user) => {
                            return user.first_name + ' ' + user.last_name
                        })
                    });
                });
    };

    componentDidMount() {
        setDocumentTitle('Share');
        const {dispatch} = this.props;
        dispatch(Actions.getShareInfo(this.props.params.id));
    }

    handleShareNew = () => {
        this.setState({
            open: true,
            edit: false
        });
    };
    handleShareEdit = (index) => {
        const userPerm = this.props.userPerms[index];
        this.setState({
            open: true,
            edit: true,
            inputPermission: userPerm.permission[0],
            searchText: userPerm.user.first_name + ' ' + userPerm.user.last_name,
            userIndex: index,
        });
    };

    handleClose = () => {
        this.setState({open: false, searchText: ''});
    };

    _handleSubmit(e) {
        e.preventDefault();
        console.log("Submit");
        if (this.state.userIndex != -1) {
            const {dispatch} = this.props;
            dispatch(Actions.shareSnippet(this.props.params.id, {
                user: this.state.edit ? this.props.userPerms[this.state.userIndex].user :
                    this.state.users[this.state.userIndex],
                permission: this.state.inputPermission,
                otp_code: this.state.inputCode
            }, this.state.edit))
        }
        this.handleClose();
    }

    _updatePermissionValue(evt, key, payload) {
        this.setState({
            inputPermission: payload
        });
    }

    _updateInputValue(evt) {
        this.setState({
            [evt.target.id]: evt.target.value
        });
    }

    render() {
        if (this.props.fetched) {
            return (
                <div>
                    <h2>Share settings</h2>
                    <div className="row">
                        <div className="col-sm-4">
                            {this.props.userPerms.length ?
                                <List>
                                    {this.props.userPerms.map((userPerm, index) => {
                                        return <ListItem key={index}
                                                         onTouchTap={() => this.handleShareEdit(index)}
                                                         rightIconButton={
                                                             <Chip style={{marginTop: '8px'}}>
                                                                 {userPerm.permission[1]}
                                                             </Chip>}
                                                         primaryText={userPerm.user.first_name + ' ' + userPerm.user.last_name}
                                        />
                                    })}
                                </List> :
                                <p>There is no user with permissions for this Snippet</p>}
                        </div>
                        <div className="col-sm-8">
                            <RaisedButton label="Share with" onClick={this.handleShareNew}/>
                        </div>
                        <Dialog open={this.state.open}
                                title="Permissions settings"
                                onRequestClose={this.handleClose}>
                            <form onSubmit={::this._handleSubmit}>
                                <div className="row">
                                    <AutoComplete
                                        disabled={this.state.edit}
                                        searchText={this.state.searchText}
                                        hintText="Type user name"
                                        onNewRequest={(chosenRequest, index) => {
                                            if (index != -1) {
                                                this.setState({
                                                    userIndex: index
                                                })
                                            }
                                        }}
                                        dataSource={this.state.dataUserSource}
                                        onUpdateInput={this.handleUpdateUser}
                                    />
                                </div>
                                <div className="row">
                                    <SelectField
                                        floatingLabelText="Permission"
                                        errorText={!this.state.inputPermission && 'This field is required'}
                                        value={this.state.inputPermission}
                                        onChange={::this._updatePermissionValue}
                                    >
                                        {this.props.allPerms.map((perm) => {
                                            return <MenuItem key={perm[0]}
                                                             primaryText={perm[1]}
                                                             value={perm[0]}/>
                                        })}
                                    </SelectField>
                                </div>
                                <div className="row">
                                    <TextField
                                        required
                                        floatingLabelText="OTP Code"
                                        value={this.state.inputCode}
                                        id="inputCode"
                                        onChange={::this._updateInputValue}
                                    />
                                </div>
                                <div className="row end-xs">
                                    <FlatButton
                                        label="Cancel"
                                        primary={true}
                                        onTouchTap={this.handleClose}
                                    />
                                    <FlatButton
                                        label="Submit"
                                        primary={true}
                                        type="submit"
                                    />
                                </div>
                            </form>
                        </Dialog>
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
    fetched: state.share.fetched,
    allPerms: state.share.allPermissions,
    userPerms: state.share.userPermissions
});
export default connect(mapStateToProps)(ShareView);
