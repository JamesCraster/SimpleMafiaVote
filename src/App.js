import React from "react";
import Vote from "./Vote";
import {
  Input,
  Form,
  Button,
  Header,
  Label,
  TextArea,
} from "semantic-ui-react";
import VoteHistory from "./VoteHistory";
import socketIOClient from "socket.io-client";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { socket: socketIOClient("localhost:8000") };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.reset = this.reset.bind(this);
  }
  handleSubmit(event) {
    let data = new FormData(event.target);
    if (data.get("name").length != 0) {
      this.state.socket.emit("addPlayer", data.get("name"));
      var element = document.getElementById("nameForm");
      element.parentNode.removeChild(element);
    }
  }

  reset() {
    if (
      window.confirm(
        "Are you sure you want to restart the app? This will kick everyone and erase the voting history.",
      )
    ) {
      this.state.socket.emit("restart");
    }
  }
  render() {
    return (
      <div className="App">
        <br />
        <h1>Mafia Voting</h1>
        <Form id="nameForm" onSubmit={this.handleSubmit}>
          <Label>
            (NB: If you've accidentally refreshed the page, just enter the same
            name again to regain control of that player)
          </Label>
          <Input
            maxLength="15"
            id="name"
            placeholder="Enter your name:"
            name="name"
          />
          <Button type="submit">{"Join"}</Button>
        </Form>
        <br />
        <Vote socket={this.state.socket} />
        <br />
        <VoteHistory socket={this.state.socket} />
        <br />
        <Button onClick={this.reset} color="red">
          Reset
        </Button>
      </div>
    );
  }
}

export default App;
