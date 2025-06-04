import React, { useState, useEffect, createContext, useContext } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";

// const rootUrl = "https://api.github.com";

const GlobalContext = createContext();

export const UseGlobalContext = () => useContext(GlobalContext);

const AppContext = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser);
  const [repos, setRepos] = useState(mockRepos);
  const [followers, setFollowers] = useState(mockFollowers);
  const [requests, setRequests] = useState(0);
  const [isloading, setIsLoading] = useState(false);
  const [error, setError] = useState({ show: false, msg: "" });

  // search github user
  const searchGithubUser = async (user) => {
    toggleError();
    setIsLoading(true);
    const response = await axios(`/users/${user}`).catch((err) => {
      console.log(err);
    });

    if (response) {
      setGithubUser(response.data);

      const { login, followers_url } = response.data;

      // axios(`users/${login}/repos?per_page=100`).then((response) => {
      //   setRepos(response.data);
      // });

      // axios(`${followers_url}?per_page=100`).then((response) => {
      //   setFollowers(response.data);
      // });

      await Promise.allSettled([
        axios(`users/${login}/repos?per_page=100`),
        axios(`${followers_url}?per_page=100`),
      ])
        .then((results) => {
          const [repos, followers] = results;
          const status = "fulfilled";

          if (repos.status === status) {
            setRepos(repos.value.data);
          }

          if (followers.status === status) {
            setFollowers(followers.value.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      toggleError(true, "there is not user with that username ");
    }
    checkRequests();
    setIsLoading(false);
  };

  // check rate
  const checkRequests = () => {
    axios("/rate_limit")
      .then((data) => {
        let {
          rate: { remaining },
        } = data.data;
        setRequests(remaining);

        if (remaining === 0) {
          toggleError(true, "sorry you have exceded your hourly rate limit");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const toggleError = (show = false, msg = "") => {
    setError({ show, msg });
  };

  useEffect(checkRequests, []);

  return (
    <GlobalContext.Provider
      value={{
        githubUser,
        repos,
        followers,
        requests,
        error,
        searchGithubUser,
        isloading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default AppContext;
