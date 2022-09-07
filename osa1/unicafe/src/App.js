import { useState } from 'react';

const Header = (props) => {
  return (
    <h2>
      {props.text}
    </h2>
  );
};

const Button = (props) => {
  return (
    <button onClick={props.handleClick}>
      {props.text}
    </button>
  );
};

const StatisticLine = (props) => {
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  );
};

const Statistics = (props) => {
  const stats = props.table;

  const feedbackCount = stats[0] + stats[1] + stats[2];
  if (feedbackCount === 0) {
    return (
      <p>No feedback given</p>
    );
  }

  const positiveFeedback = (stats[0] / feedbackCount) * 100;
  const average = (stats[0] + (stats[2] * (-1))) / feedbackCount;


  return (
    <table>
      <tbody>
        <StatisticLine text="Good" value={stats[0]}/>
        <StatisticLine text="Neutral" value={stats[1]}/>
        <StatisticLine text="Bad" value={stats[2]}/>
        <StatisticLine text="All" value={feedbackCount}/>
        <StatisticLine text="Average" value={average}/>
        <StatisticLine text="Positive" value={positiveFeedback}/>
      </tbody>
    </table>
  );
};

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const arr = [good, neutral, bad];

  const giveGoodFeedback = () => {
    return setGood(good + 1);
  };

  const giveNeutralFeedback = () => {
    return setNeutral(neutral + 1);
  };

  const giveBadFeedback = () => {
    return setBad(bad + 1);
  };

  return (
    <div>
      <Header text="give feedback"/>
      <Button handleClick={giveGoodFeedback} text="Good"/>
      <Button handleClick={giveNeutralFeedback} text="Neutral"/>
      <Button handleClick={giveBadFeedback} text="Bad"/>
      <Header text="statistics"/>
      <Statistics table={arr.concat()}/>
    </div>
  )
}

export default App
