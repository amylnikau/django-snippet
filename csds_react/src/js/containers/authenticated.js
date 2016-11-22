import React from "react";
import {connect} from "react-redux";
import {List, ListItem} from "material-ui/List";
import HomeIcon from "material-ui/svg-icons/action/home";
import CreateIcon from "material-ui/svg-icons/content/create";
import PeopleIcon from "material-ui/svg-icons/social/people";
import SuperVisorAccount from "material-ui/svg-icons/action/supervisor-account";
import {Link} from "react-router";

class AuthenticatedContainer extends React.Component {

    render() {
        const {currentUser, dispatch} = this.props;

        if (!currentUser) return null;

        return (

            <div className="row">
                <div className="col-sm-2">
                    <List>
                        <ListItem primaryText="Home"
                                  containerElement={<Link to="/"/>}
                                  leftIcon={<HomeIcon />}/>
                        <ListItem primaryText="New snippet"
                                  containerElement={<Link to="/snippet/new"/>}
                                  leftIcon={<CreateIcon />}/>
                        <ListItem primaryText="Shared with me"
                                  containerElement={<Link to="/shared-with-me"/>}
                                  leftIcon={<PeopleIcon />}/>
                        {this.props.currentUser.is_superuser ?
                            <ListItem primaryText="Admin panel"
                                      href="/admin/"
                                      leftIcon={<SuperVisorAccount />}/> : null}
                    </List>
                </div>
                <div className="col-sm-10 main-container">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    currentUser: state.session.currentUser,
});

export default connect(mapStateToProps)(AuthenticatedContainer);
