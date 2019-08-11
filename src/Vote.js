import React from "react";
import { List, Segment, Button } from "semantic-ui-react";

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
          {`${this.state.players[i].name} - (${
            this.state.players[i].voters.length
          }) ${this.state.players[i].voters.join(", ")}`}
          <Button
            data-player={this.state.players[i].name}
            size="small"
            onClick={this.handleVote}
            style={{ marginLeft: "15px" }}
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
