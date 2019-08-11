import React from "react";
import { List, Button, Segment, ListItem } from "semantic-ui-react";

class VoteHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [],
    };
    this.props.socket.on("updateHistory", history => {
      this.setState({ history: history });
    });
  }
  render() {
    let history = [];
    console.log(this.state.history);
    for (let i = 1; i <= this.state.history.length; i++) {
      history.push(
        <List.Item>
          <span style={{ float: "left" }}>
            {this.state.history[this.state.history.length - i].time}
          </span>
          <span>
            {this.state.history[this.state.history.length - i].string}
          </span>
        </List.Item>,
      );
    }
    return (
      <div>
        <h2>Voting history:</h2>
        <Segment
          style={{
            width: "50%",
            marginLeft: "auto",
            marginRight: "auto",
            height: "300px",
            overflow: "auto",
          }}
        >
          <List>
            {history}
            <ListItem style={{ fontStyle: "italic" }}>
              {"This is the beginning of the voting history"}
            </ListItem>
          </List>
        </Segment>
      </div>
    );
  }
}

export default VoteHistory;
