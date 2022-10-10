import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'

const Anecdote = ({anecdote, handleVote}) => {
    return (
      <div>
        <div>
          {anecdote.content}
        </div>
        <div>
          has {anecdote.votes}
          <button onClick={handleVote}>vote</button>
        </div>
      </div>
    )
}

const AnecdoteList = (props) => {

  const anecdotes = useSelector(state => state)
  const dispatch = useDispatch()

  const vote = (id) => {
    console.log('vote', id)
    dispatch(voteAnecdote(id));
  }

  return (
    <div>
      {anecdotes.map(anecdote => {
        return (
          <Anecdote
            key={anecdote.id}
            anecdote={anecdote}
            handleVote={() => vote(anecdote.id)}
          />
        )
      })}
    </div>
  )
}

export default AnecdoteList