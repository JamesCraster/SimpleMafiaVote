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
  }
  handleSubmit(event) {
    let data = new FormData(event.target);
    this.state.socket.emit("addPlayer", data.get("name"));
    var element = document.getElementById("nameForm");
    element.parentNode.removeChild(element);
  }
  render() {
    return (
      <div className="App">
        <h1>Mafia Voting</h1>
        <Form id="nameForm" onSubmit={this.handleSubmit}>
          <Input id="name" placeholder="Enter your name:" name="name" />
          <Button type="submit">{"Join"}</Button>
        </Form>
        <Vote socket={this.state.socket} />
        <VoteHistory socket={this.state.socket} />
      </div>
    );
  }
}

export default App;
