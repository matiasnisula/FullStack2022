import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotificationMessage, deleteNotification } from '../reducers/notificationReducer'

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

  let anecdotes = useSelector(state => state.anecdotes)
  const filter = useSelector(state => state.filter)
  if (filter !== '') {
    anecdotes = anecdotes.filter(anecdote => {
      return anecdote.content.toLowerCase().includes(filter.toLowerCase())
    })
  }
  const dispatch = useDispatch()

  const vote = (id) => {
    console.log('vote', id)
    dispatch(voteAnecdote(id));
    const anecdoteVoted = anecdotes.find(anecdote => {
      return anecdote.id === id;
    })
    dispatch(setNotificationMessage(`you voted '${anecdoteVoted.content}'`))
    setTimeout(() => {
      dispatch(deleteNotification())
    }, 5000);
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