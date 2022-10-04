import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
  token = `bearer ${newToken}`;
}

const getAll = async () => {
  const response = await axios.get(baseUrl);
  //console.log("(GET) response.data: ", response.data);
  return response.data;
}

const create = async (blogObject) => {
  const config = {
    headers: {Authorization: token}
  };

  const response = await axios.post(baseUrl, blogObject, config);
  console.log("(POST) added user: ", response.data);
  return response.data;
}

const update = async (blogObject) => {
  const config = {
    headers: {Authorization: token}
  };
  console.log("(PUT) blogObject to be updated: ", blogObject);
  const response = await axios.put(`${baseUrl}/${blogObject.id}`, blogObject, config);
  console.log("(PUT) response from update: ", response.data);
  return response.data;
}

const remove = async (id) => {
  const config = {
    headers: {Authorization: token}
  };
  console.log("ObjectID too be deleted: ", id);
  const response = await axios.delete(`${baseUrl}/${id}`, config);
  console.log("response after delete: ", response);
  return response.data;
}

export default { 
  getAll,
  create,
  setToken,
  update,
  remove
}