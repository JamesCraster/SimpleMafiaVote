import React from "react";
import io from "socket.io-client";
import {
  Input,
  Form,
  Button,
  Header,
  Label,
  TextArea,
} from "semantic-ui-react";
import "./App.css";

class GreaterIdea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: io("localhost:8000"),
      playerRoles: [],
    };
    let component = this;
    this.state.socket.on("updateDiscards", (discards) => {
      component.setState({ playerRoles: discards });
    });
  }
  render() {
    return (
      <div className="App">
        <br/>
        <h1>Greater idea</h1>
        <p>Discards:</p>
        <ul>
          {this.state.playerRoles.map((role) => (
            <li>{role}</li>
          ))}
        </ul>
      </div>
    );
  }
}

export default GreaterIdea;
