import React from "react";
import Vote from "./Vote";
import { Input, Form, Button, Header } from "semantic-ui-react";
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
    this.state.socket.emit("addPlayer", data.get("name"));
    var element = document.getElementById("nameForm");
    element.parentNode.removeChild(element);
  }
  reset() {
    if (window.confirm("Are you sure you want to reset the voting?")) {
      this.state.socket.emit("reset");
    }
  }
  render() {
    return (
      <div className="App">
        <br />
        <h1>Mafia Voting</h1>
        <Form id="nameForm" onSubmit={this.handleSubmit}>
          <Input id="name" placeholder="Enter your name:" name="name" />
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
