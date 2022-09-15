import { useState, useEffect } from 'react';
import { Display } from "./components/Display.js"
import Filter from "./components/Filter.js"



const App = () => {

  const [newQuery, setNewQuery] = useState("");
  const [countries, setCountries] = useState([]);
  const [selectedCountryInd, setSelectedCountryInd] = useState(-1);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
    .then((response) => {
      if (!response.ok) {
        console.log("Error:", response.status)
      }
      return response.json();
    })
    .then((data) => {
      setCountries(data);
    })
  }, []);

  
  const printCountries = () => {
    for (let i = 0; i < 1; i++) {
      console.log(countries[i]);
      for (let prop in countries[i]) {
        console.log(`${countries[i]}.${prop} = ${countries[i][prop]}`)
        console.log(`typeof prob ${prop} = ${typeof countries[i][prop]}`)
        console.log("")
        console.log("")
        if (typeof countries[i][prop] === "object") {
          for (let prop1 in countries[i][prop]) {
            console.log(`${countries[i][prop]}.${prop1} = ${countries[i][prop][prop1]}`)
            console.log("")
          }
        }
      }
    }
  };
 
  const findCountries = () => {
    return (
      countries.filter((country) => {
        return country.name.common.toLowerCase().includes(newQuery.toLowerCase());
      })
    );
  };
  
  const handleQueryChange = (event) => {
    setNewQuery(event.target.value);
    setSelectedCountryInd(-1);
  };
  
  return (
    <div>
      <Filter newQuery={newQuery.slice()} handleQueryChange={handleQueryChange} />
      <Display countriesArr={(newQuery.length === 0) ? [] : findCountries()}
                selectedCountryInd={selectedCountryInd}
                setSelectedCountryInd={setSelectedCountryInd} />
    </div>
  );
};

export default App;