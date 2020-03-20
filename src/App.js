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
  Dimmer,
  Segment,
} from "semantic-ui-react";
import VoteHistory from "./VoteHistory";
import "./App.css";
window.socket = io('localhost:8000');
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: window.socket,
      inRoom: false,
      named: false,
    };
    this.handleRoomSubmit = this.handleRoomSubmit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.reset = this.reset.bind(this);
    this.clearVotes = this.clearVotes.bind(this);
    this.state.socket.on("enterRoom", function () {
      this.setState({ inRoom: "true" });
    });
  }
  handleSubmit(event) {
    let data = new FormData(event.target);
    if (data.get("name").length != 0) {
      console.log(data.get("name"));
      this.state.socket.emit("addPlayer", data.get("name"));
      var element = document.getElementById("nameForm");
      element.style.display = "none";
    }
  }
  handleRoomSubmit(event) {
    let data = new FormData(event.target);
    if (data.get("room").length != 0) {
      this.state.socket.emit("enterRoom", data.get("room"));
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
        <Button color="blue" type="submit">
          {"Create Room"}
        </Button>
        <br></br>
        <br></br>
        <Form
          id="roomForm"
          onSubmit={this.handleRoomSubmit}
          style={{ display: this.state.inRoom ? "none" : "default" }}
        >
          <Input
            maxLength="5"
            name="room"
            placeholder="Enter room code"
          ></Input>
          <Button type="submit">{"Join"}</Button>
        </Form>
        <Dimmer.Dimmable dimmed={!this.state.inRoom}>
          <Dimmer active={false} inverted></Dimmer>
          <Form
            id="nameForm"
            onSubmit={this.handleSubmit}
            style={{ display: this.state.named ? "none" : "default" }}
          >
            <p>
              (NB: If you've accidentally refreshed the page, just enter the
              same name again to regain control of that player)
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
        </Dimmer.Dimmable>
      </div>
    );
  }
}

export default App;
