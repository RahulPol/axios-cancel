import SearchCharacters from "./components/SearchCharacters/SearchCharacters";

import logo from "./assets/images/star-wars-logo.svg";
import "./App.css";

function App() {
  return (
    <div className="app">
      <img src={logo} className="app-logo" alt="logo" />
      <SearchCharacters />
    </div>
  );
}

export default App;
