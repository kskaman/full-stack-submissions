import { useState } from 'react'


const Button = ({txt, v, handleClick}) => (
  <button onClick={handleClick}>{txt}</button>
)


const StatisticLine = ({txt, v}) => (
  <tr>
    <td>{txt}</td>
    <td>{v}</td>
  </tr>
)

const Statistics = ({good, neutral, bad}) => {
  const total = good + bad + neutral
  const avg = (total === 0) ? 0 : (good - bad) / total
  const positiveReview = (total === 0) ? 0 : good / total * 100

  return <table>
    <tbody>
      <StatisticLine txt={"good"} v={good} />
      <StatisticLine txt={"neutral"} v={neutral} />
      <StatisticLine txt={"bad"} v={bad} />
      <StatisticLine txt={"total"} v={total} />
      <StatisticLine txt={"average"} v={avg} />
      <StatisticLine txt={"positive"} v={positiveReview + " %"} />
    </tbody>
  </table>
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  
  const totalFeedback = good + neutral + bad
 
  return (
    <div>
      <h1>give feedback</h1>
      <span>
        <Button txt={"good"} handleClick={() => setGood(good+1)} />
        <Button txt={"neutral"} handleClick={() => setNeutral(neutral+1)} />
        <Button txt={"bad"} v={bad} handleClick={() => setBad(bad+1)} />
      </span>
      <h1>statistics</h1>
      {totalFeedback === 0 ? (
        <div>No feedback given</div>
      ) : (
        <Statistics good={good} neutral={neutral} bad={bad}/>
      )}
    </div>
  )
}

export default App