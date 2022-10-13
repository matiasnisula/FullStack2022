import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

/*
const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}


const initialState = anecdotesAtStart.map(asObject)
*/

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    appendUpdatedAnecdote(state, action) {
      const updatedAnecdote = action.payload
      
      return state.map(anecdote => {
        return anecdote.id !== updatedAnecdote.id ? anecdote : updatedAnecdote
      })
      .sort((a, b) => {
        return b.votes - a.votes
      })
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

console.log("anecdoteSlice: ", anecdoteSlice)

export const { appendAnecdote, appendUpdatedAnecdote, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async (dispatch, getState) => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = (content) => {
  return async (dispatch, getState) => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const voteAnecdote = (id) => {
  return async (dispatch, getState) => {
    const anecdotes = getState().anecdotes
    const anecdoteToVote = anecdotes.find(anecdote => {
      return anecdote.id === id
    })
    const newAnecdote = {
      ...anecdoteToVote,
      votes: anecdoteToVote.votes + 1
    }

    const modifiedAnecdote = await anecdoteService.update(newAnecdote)
    dispatch(appendUpdatedAnecdote(modifiedAnecdote))
  }
}

export default anecdoteSlice.reducer