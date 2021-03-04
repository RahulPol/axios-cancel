const express = require("express");
const axios = require("axios");
const path = require("path");
require("dotenv").config();

const app = express();

// use the build output of the react app as your client
const publicPath = path.join(__dirname, "client/build");
app.use(express.static(publicPath));

const getPage = async (url) => {
  const response = await axios.get(url);
  if (response.statusText == "OK") {
    return Promise.resolve(response.data);
  }
  return Promise.reject(response);
};

const getAllPages = async (url, collection = []) => {
  const response = await getPage(url);
  const { results, next } = response;
  collection = [...collection, ...results];
  if (next !== null) {
    return getAllPages(next, collection);
  }
  return collection;
};

const searchPeople = async (req, res, next) => {
  try {
    let query = req.query.searchString;
    const response = await getAllPages(
      "https://swapi.dev/api/people?search=" + query
    );
    if (!response) {
      res.status(200).send([]);
    }
    res.status(200).send(response);
  } catch (err) {
    res.status(500).send(err);
  }
};

// this should have separate route, controller method but for simplicity replying from here.
app.get("/search/characters", searchPeople);

// root path will serve the index html present in client folder.
app.get("/", (req, res, next) => {
  res.send(path.join(publicPath, "index.html"));
});

app.listen(process.env.PORT, () => {
  console.log(`server started on port ${process.env.PORT}`);
});
