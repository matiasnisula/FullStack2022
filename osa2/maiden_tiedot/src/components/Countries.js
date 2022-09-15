
const Button = (props) => {
    return (
      <button onClick={props.selectCountry}>
        show
      </button>
    )
};

const Countries = (props) => {
  const {countries, setSelectedCountryInd} = props;
  
  return (
    <div>
      {countries.map((country, ind) => {
        return (
          <div key={country.name.common}> {country.name.common}
          <Button selectCountry={() => setSelectedCountryInd(ind)} />
          </div>
        )
      })}
    </div>
  );
};

export {Countries};