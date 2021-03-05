import React, { useState, useEffect } from "react";
import axios from "axios";
import { v4 } from "uuid";

import "./SearchCharacters.css";

const SearchCharacters = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [responseEntries, setResponseEntries] = useState([]);
  const [characters, setCharacters] = useState("");

  let responseList;

  useEffect(() => {
    let cancelToken;
    //Check if there are any previous pending requests
    if (typeof cancelToken != typeof undefined) {
      cancelToken.cancel("Operation canceled due to new request.");
    }

    cancelToken = axios.CancelToken.source();

    const fetchData = async () => {
      try {
        if (searchQuery === "") {
          performance.clearResourceTimings();
          setResponseEntries([]);
          return;
        }
        const response = await axios.get(
          "/search/characters?searchString=" + searchQuery,
          {
            cancelToken: cancelToken.token,
          }
        );

        if (response.status === 200) {
          setCharacters(response.data);
        }

        setTimeout(() => {
          const entries = performance.getEntries().filter((item) => {
            return item.name.includes("/search/characters?searchString=");
          });
          const updatedEntries = entries.slice(responseEntries.length);
          setResponseEntries([...responseEntries, ...updatedEntries]);
        }, 100);
      } catch (error) {}
    };

    fetchData();
    return () => {
      cancelToken.cancel();
    };
  }, [searchQuery]);

  if (responseEntries.length > 0) {
    responseList = responseEntries.map((entry) => {
      const url = new URL(entry.name);
      const status =
        entry.responseStart === 0 && entry.decodedBodySize === 0 ? (
          <span style={{ color: "red" }}> canceled</span>
        ) : (
          <span style={{ color: "green" }}> passed</span>
        );
      return (
        <tr key={v4()}>
          <td>{url.pathname}</td>
          <td>{url.search}</td>
          <td>{status}</td>
          <td>{entry.transferSize} Byte</td>
        </tr>
      );
    });
  }

  return (
    <div className="search-wrapper">
      <input
        className="character-search-input"
        type="text"
        placeholder="Click here and search..."
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className="response-entries">
        <table rules="all">
          <thead>
            <tr>
              <th>Path</th>
              <th>Search</th>
              <th>status</th>
              <th>Response Size</th>
            </tr>
          </thead>
          <tbody>{responseList}</tbody>
        </table>
      </div>
    </div>
  );
};

export default SearchCharacters;
