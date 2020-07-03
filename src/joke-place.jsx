import React, { Component } from "react";
import axios from "axios";
import Joke from "./joke";
import "./joke-place.css";
class JokePlace extends Component {
  constructor(props) {
    super(props);
    this.state = { jokeList: [] };
  }
  async componentDidMount() {
    for (let i = 0; i < 10; i++) {
      const response = await axios.get("https://icanhazdadjoke.com/", {
        headers: { Accept: "application/json" },
      });
      const jokeData = response.data;
      console.log(jokeData);
      this.setState((st) => ({
        jokeList: [
          ...st.jokeList,
          { joke: jokeData.joke, id: jokeData.id, votes: 0 },
        ],
      }));
    }
  }
  handleVote(id, delta) {
    return this.setState((st) => ({
      jokeList: st.jokeList.map((j) =>
        j.id === id ? { ...j, votes: j.votes + delta } : j
      ),
    }));
  }
  render() {
    const jokes = this.state.jokeList.map((joke) => (
      <Joke
        joke={joke.joke}
        key={joke.id}
        votes={joke.votes}
        upVote={() => this.handleVote(joke.id, 1)}
        downVote={() => this.handleVote(joke.id, -1)}
      />
    ));
    return (
      <div className="JokePlace">
        <div className="side-bar">
          <h1>Dad Jokes</h1>
          <button>More Jokes!</button>
        </div>

        <div className="jokes">{jokes}</div>
      </div>
    );
  }
}

export default JokePlace;
