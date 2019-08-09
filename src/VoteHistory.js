import React from "react";
import { List, Button, ListItem } from "semantic-ui-react";

class VoteHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [],
    };
  }
  render() {
    let history = [];
    for (let i = 0; i < this.state.history.length; i++) {
      history.push(
        <List.Item>
          <span>{this.state.history[i]}</span>
        </List.Item>,
      );
    }
    return (
      <div>
        <h2>Voting history:</h2>
        <List bulleted>
          <ListItem>{"This is the beginning of the voting history"}</ListItem>
          {history}
        </List>
      </div>
    );
  }
}

export default VoteHistory;
