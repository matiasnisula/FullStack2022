const Header = (props) => {
    return (
      <h1>
        {props.name}
      </h1>
    );
  };
  
const CountryInfo = (props) => {
  return (
    <div>
      <p>capital {props.country.capital[0]}</p>
      <p>area {props.country.area}</p>
    </div>
  )
};

const CountryLanguageInfo = (props) => {
  return (
    <ul>
      {Object.values(props.country.languages).map((language) => {
        return (
          <li key={language}>{language}</li>
        );
      })}
    </ul>
  )
};

const CountryImg = (props) => {
  return (
    <img 
      src={props.country.flags.png} 
      alt="country flag">
    </img>
  );
};

const Country = (props) => {
  const {country} = props;
  return (
    <div>
      <Header name={country.name.common} />
      <CountryInfo country={country} />
      <h3>languages:</h3>
      <CountryLanguageInfo country={country} />
      <CountryImg country={country}/>
    </div>
  );
};


export {Country};