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

class Moderator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            socket: io('localhost:8000'),
            playerRoles: [],
            roles: []
        };
        this.state.socket.emit("moderator");
        let component = this
        this.state.socket.on("updateModerator", function (newRoles) {
            component.setState({ playerRoles: newRoles });
        });
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit(event) {
        let data = new FormData(event.target);
        if (data.get("roles").length != 0) {
            this.setState({ roles: data.get("roles").split(",") })
            this.state.socket.emit("updateRoles", data.get("roles").split(","));
        }
    }
    render() {
        return (
            <div className="App">
                <br></br>
                <h1>This is the moderation area.</h1>
                <p>NOTE: Carefully comma-separate your roles, otherwise the server will crash and restart.</p>
                <Form onSubmit={this.handleSubmit}>
                    <Input name="roles" placeholder="Enter comma-separated roles"></Input>
                </Form>
                <p>Roles:</p>
                <ul>{this.state.roles.map(role => <li>{role}</li>)}</ul>
                <p>Players:</p>
                <ul>{this.state.playerRoles.map((role) => <li>{role}</li>)}</ul>
            </div>
        );
    }
}

export default Moderator;
