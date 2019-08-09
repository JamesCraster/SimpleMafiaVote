import React from "react";
import { List, Button } from "semantic-ui-react";

class Vote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      players: [],
    };
    this.props.socket.on("updatePlayers", object => {
      this.setState({ players: object });
      console.log(this.state.players);
    });
  }
  render() {
    let listItems = [];
    let key = 0;
    for (let i = 0; i < this.state.players.length; i++) {
      listItems.push(
        <List.Item key={key}>
          {this.state.players[i].name}
          <Button>{"Vote"}</Button>
        </List.Item>,
      );
      key++;
    }
    return (
      <div>
        <h2>Players:</h2>
        <List bulleted>{listItems}</List>
      </div>
    );
  }
}

export default Vote;
