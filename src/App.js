import React from "react";
import Vote from "./Vote";
import io from "socket.io-client";
import {
  Input,
  Form,
  Button,
  Header,
  Label,
  TextArea,
} from "semantic-ui-react";
import VoteHistory from "./VoteHistory";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: io('localhost:8000'),
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.reset = this.reset.bind(this);
    this.clearVotes = this.clearVotes.bind(this);
    this.state.socket.on("restart", function () {
      console.log("reload");
      window.location.reload(true);
    })
  }
  handleSubmit(event) {
    let data = new FormData(event.target);
    if (data.get("name").length != 0) {
      this.state.socket.emit("addPlayer", data.get("name"));
      var element = document.getElementById("nameForm");
      element.parentNode.removeChild(element);
    }
  }
  clearVotes() {
    if (window.confirm("Are you sure you want to clear votes?")) {
      this.state.socket.emit("clearVotes");
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
          <p>
            (NB: If you've accidentally refreshed the page, just enter the same
            name again to regain control of that player)
          </p>
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
        <Button onClick={this.clearVotes} color="red">
          Clear Votes
        </Button>
        <Button onClick={this.reset} color="red">
          Reset All
        </Button>
      </div>
    );
  }
}

export default App;
