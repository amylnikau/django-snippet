import React from "react";
import {Card, CardText, CardTitle} from "material-ui/Card";
import { browserHistory } from 'react-router'

class SnippetCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {shadow: 1};
    }

    _onSnippetClick(id) {
        browserHistory.push("/snippet/" + id);
    }

    onMouseOver = () => this.setState({shadow: 3});
    onMouseOut = () => this.setState({shadow: 1});

    render() {
        const {snippet} = this.props;
        return (
            <Card onMouseOver={this.onMouseOver}
                  onMouseOut={this.onMouseOut}
                  zDepth={this.state.shadow}
                  style={{cursor: 'pointer'}}
                  onClick={() => ::this._onSnippetClick(snippet.id)}>
                <CardTitle title={snippet.title}/>
                <CardText>Created on: {snippet.created_on}</CardText>

            </Card>
        )
    }
}

export default SnippetCard;