const Total = ({ exerciseCountTotal }: {exerciseCountTotal: number}) => {
  return (
    <p>
      Number of exercises{" "}
      {exerciseCountTotal}
    </p>
  );
};

export default Total;