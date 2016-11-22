import React from "react";
import {connect} from "react-redux";
import AppBar from "material-ui/AppBar";
import Avatar from "material-ui/Avatar";
import IconMenu from "material-ui/IconMenu";
import MenuItem from "material-ui/MenuItem";
import IconButton from "material-ui/IconButton";
import {push} from "react-router-redux/lib/actions";
import Actions from "../actions/session";

const styles = {
    title: {
        cursor: 'pointer',
    },
};

class MainLayout extends React.Component {

    render() {
        const {user, dispatch}=this.props;
        return (
            <div>
                <AppBar
                    title={<span id="title" style={styles.title}>CSDSProject</span>}
                    onTitleTouchTap={(e)=> {
                        if (e.target.id === "title") {
                            dispatch(push('/'))
                        }
                    }}
                    showMenuIconButton={false}
                    iconElementRight={user ?
                        <IconMenu
                            iconButtonElement={<IconButton style={{padding: 0}}>
                                <Avatar>{user.first_name[0]}</Avatar>
                            </IconButton>}
                            anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                            targetOrigin={{horizontal: 'right', vertical: 'top'}}
                        >
                            <MenuItem primaryText="Sign out"
                                      onTouchTap={()=> {
                                          dispatch(Actions.logout())
                                      }}/>
                        </IconMenu> : null}
                />
                <div className="container-fluid">
                    {this.props.children}
                </div>
            </div>
        );
    }
}
const mapStateToProps = (state) => ({
    user: state.session.currentUser,
});

export default connect(mapStateToProps)(MainLayout);
