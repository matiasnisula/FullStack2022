import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  console.log("response.data (GET): ", response.data)
  return response.data
}

const createNew = async (content) => {
  const anecdoteObject = { content, votes: 0 }
  const response = await axios.post(baseUrl, anecdoteObject)
  console.log("response.data (POST): ", response.data)
  return response.data
}

const update = async (anecdoteObject) => {
  const response = await axios.put(`${baseUrl}/${anecdoteObject.id}`, anecdoteObject)
  console.log("response.data (PUT): ", response.data)
  return response.data
}

export default {
  getAll,
  createNew,
  update
}