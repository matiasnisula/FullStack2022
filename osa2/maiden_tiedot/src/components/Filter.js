const Filter = (props) => {
  return (
    <div>
      find countries <input value={props.newQuery} 
                            onChange={props.handleQueryChange}/>
    </div>
  );
};

export default Filter;