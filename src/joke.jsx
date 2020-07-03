import React, { Component } from "react";
import "./joke.css";
class Joke extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="JokeContainer">
        <div className="votes">
          <i className="fas fa-arrow-up" onClick={this.props.upVote}></i>
          <div className="displayVotes">{this.props.votes}</div>
          <i className="fas fa-arrow-down" onClick={this.props.downVote}></i>
        </div>
        <div className="Joke">{this.props.joke}</div>
      </div>
    );
  }
}

export default Joke;
