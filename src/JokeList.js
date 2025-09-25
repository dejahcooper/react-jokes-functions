import React, { useEffect, useState } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

/** List of jokes. */

export default function JokeList() {
  const numJokesToGet = 5;
  const [jokes, setJokes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  async function getJokes() {
    try {
      let newJokes = [];
      let seen = new Set();

      while (newJokes.length < numJokesToGet) {
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" },
        });
        let joke = res.data;

        if (!seen.has(joke.id)) {
          seen.add(joke.id);
          newJokes.push({ ...joke, votes: 0 });
        } else {
          console.log("duplicate found!");
        }
      }

      setJokes(newJokes);
      setIsLoading(false);
    } catch (e) {
      console.error(e);
    }
  }
  function generateNewJokes() {
    setIsLoading(true);
    getJokes();
  }

  useEffect(() => {
    generateNewJokes();
  }, []);

  function vote(id, delta) {
    setJokes((st) =>
      st.map((j) => (j.id === id ? { ...j, votes: j.votes + delta } : j))
    );
  }

  const sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);

  return isLoading ? (
    <div className="loading">
      <i className="fas fa-4x fa-spinner fa-spin" />
    </div>
  ) : (
    <div className="JokeList">
      <button className="JokeList-getmore" onClick={generateNewJokes}>
        Get New Jokes
      </button>

      {sortedJokes.map((j) => (
        <Joke text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={vote} />
      ))}
    </div>
  );
}
