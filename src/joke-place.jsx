import React, { Component } from "react";
import axios from "axios";
import Joke from "./joke";
import "./joke-place.css";
//prevent duplicate jokes
//loading feature
//sorting feature

class JokePlace extends Component {
  static defaultProps = { numOfJokes: 10 };
  constructor(props) {
    super(props);
    this.state = { jokeList: [], loading: true };
    this.requestJokes = this.requestJokes.bind(this);
    this.getMoreJokes = this.getMoreJokes.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.sortJokes = this.sortJokes.bind(this);
  }

  async componentDidMount() {
    let jokes = [];
    if (JSON.parse(localStorage.getItem("jokes"))) {
      jokes = JSON.parse(localStorage.getItem("jokes"));
      console.log(jokes);
    } else {
      jokes = await this.requestJokes();
    }

    this.setState({ jokeList: jokes, loading: false });
    localStorage.setItem("jokes", JSON.stringify(jokes));
  }

  async requestJokes() {
    let jokeList = [];
    let i = 0;
    while (i < this.props.numOfJokes) {
      const response = await axios.get("https://icanhazdadjoke.com/", {
        headers: { Accept: "application/json" },
      });
      const jokeData = response.data;

      //CHECKING FOR DUPLICATE JOKES IN THE WHOLE STATE AND THE CURRENT JOKES LIST
      if (
        this.state.jokeList.some((element) => element.id === jokeData.id) ||
        jokeList.some((element) => element.id === jokeData.id)
      ) {
        continue;
      }

      jokeList = [
        ...jokeList,
        { joke: jokeData.joke, id: jokeData.id, votes: 0 },
      ];
      i++;
    }

    return jokeList;
  }
  handleClick() {
    this.setState({ loading: true }, this.getMoreJokes);
  }

  async getMoreJokes() {
    const moreJokes = await this.requestJokes();
    const allJokes = [...this.state.jokeList, ...moreJokes];
    console.log(allJokes);
    console.log(moreJokes);
    this.setState((st) => ({ jokeList: allJokes, loading: false }));
    localStorage.setItem("jokes", JSON.stringify(allJokes));
  }

  handleVote(id, delta) {
    this.setState(
      (st) => ({
        jokeList: st.jokeList.map((j) =>
          j.id === id ? { ...j, votes: j.votes + delta } : j
        ),
      }),
      () => {
        localStorage.setItem("jokes", JSON.stringify(this.state.jokeList));
        this.sortJokes(this.state.jokeList);
      }
    );
  }
  //SORTING JOKES
  sortJokes(jokesList) {
    const sortedJokes = jokesList.sort((a, b) => b.votes - a.votes);

    this.setState({ jokeList: sortedJokes });
  }

  render() {
    if (this.state.loading) {
      return (
        <div className="JokeList-spinner">
          <i className="far fa-8x fa-laugh fa-spin" />
          <h1 className="JokeList-title">Loading...</h1>
        </div>
      );
    }
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
          <h1 role="heading">Dad Jokes </h1>
          <button onClick={this.handleClick}>More Jokes!</button>
        </div>

        <div className="jokes">{jokes}</div>
      </div>
    );
  }
}

export default JokePlace;
