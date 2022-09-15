import {Country} from "./Country.js"
import {Countries} from "./Countries.js"

const Error = (props) => {
  return (
    <p>{props.text}</p>
  );
};
  
  
const Display = (props) => {

  const {countriesArr, selectedCountryInd, setSelectedCountryInd} = props;
  if (countriesArr.length > 10) {
    return (
      <Error text="Too many matches, specify another filter" />
    );
  } else if (countriesArr.length < 10 && countriesArr.length > 1
              && selectedCountryInd === -1) {
      return (
        <Countries countries={countriesArr} 
                   setSelectedCountryInd={setSelectedCountryInd}/>
      );
  } else if (countriesArr.length === 1) {
      return (
        <Country country={countriesArr[0]} />
      );
  } else if (selectedCountryInd !== -1) {
      return (
        <Country country={countriesArr[selectedCountryInd]} />
      );
  }
    
};


export {Display};