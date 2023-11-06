import { useState, useEffect } from "react";
import { getAll } from "./services/countries.js";
import Searcher from "./components/Searcher.jsx";
import Countries from "./components/Countries.jsx";

function App() {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getAll().then((data) => {
      setCountries(data);
      setLoading(false);
      console.log("Countries loaded");
    });
  }, []);
  const handleInput = (event) => {
    event.preventDefault();
    setFilter(event.target.value);
  };
  return (
    <>
      <Searcher onChange={handleInput} />
      {loading ? <p>Loading Data...</p> : <Countries countries={countries} />}
    </>
  );
}

export default App;
