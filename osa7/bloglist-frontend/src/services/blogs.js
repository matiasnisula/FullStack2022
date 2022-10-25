import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
  token = `bearer ${newToken}`;
};

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async (blogObject) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.post(baseUrl, blogObject, config);
  return response.data;
};

const update = async (blogObject) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.put(
    `${baseUrl}/${blogObject.id}`,
    blogObject,
    config
  );
  return response.data;
};

const createComment = async (blogObject) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.post(
    `${baseUrl}/${blogObject.id}/comments`,
    blogObject,
    config
  );
  return response.data;
};

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.delete(`${baseUrl}/${id}`, config);
  return response.data;
};

export default {
  getAll,
  create,
  setToken,
  update,
  remove,
  createComment,
};
