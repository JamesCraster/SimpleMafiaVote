import React from "react";
import { List, Segment, Button, Icon } from "semantic-ui-react";

class Vote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      players: [],
    };
    this.props.socket.on("updatePlayers", object => {
      this.setState({ players: object });
    });
    this.handleVote = this.handleVote.bind(this);
    this.handleDead = this.handleDead.bind(this);
  }
  handleDead(event) {
    this.props.socket.emit("toggleDead", event.target.getAttribute("data-player"));
  }
  handleVote(event) {
    this.props.socket.emit("vote", event.target.getAttribute("data-player"));
  }
  render() {
    let listItems = [];
    let key = 0;
    for (let i = 0; i < this.state.players.length; i++) {
      listItems.push(
        <List.Item key={key}>
          <Button data-player={this.state.players[i].name} size="small" style={{ float: "left" }} onClick={this.handleDead}>
            {'Toggle Dead'}
          </Button>
          <span style={{ textDecoration: this.state.players[i].dead ? "line-through" : "none" }}>
            {`${this.state.players[i].name} - (${
              this.state.players[i].voters.length
              }) ${this.state.players[i].voters.join(", ")}`}
          </span>

          <Button style={{ visibility: this.state.players[i].dead ? "hidden" : "visible", marginLeft: "15px", marginRight: "100px" }}
            data-player={this.state.players[i].name}
            size="small"
            onClick={this.handleVote}
          >
            {"Vote"}
          </Button>
        </List.Item>,
      );
      key++;
    }
    return (
      <div>
        <h2>{`Players (${this.state.players.length}):`}</h2>
        <Segment
          style={{ width: "50%", marginLeft: "auto", marginRight: "auto" }}
        >
          <List>{listItems}</List>
        </Segment>
      </div>
    );
  }
}

export default Vote;
