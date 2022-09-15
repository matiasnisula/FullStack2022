import axios from 'axios';

const baseUrl = "http://localhost:3001/persons"

const getAll = () => {
    return axios
              .get(baseUrl)
              .then(response => {
                  return response.data;
              });
};

const create = (newPerson) => {
    return axios
                .post(baseUrl, newPerson)
                .then(response => {
                    return response.data;
                });

};

const deletePerson = (id) => {
    return axios
                .delete(`${baseUrl}/${id}`)
                .then(response => {
                    return response.data;
                });
};

const update = (id, changedPerson) => {
    return axios
                .put(`${baseUrl}/${id}`, changedPerson)
                .then(response => {
                    return response.data;
                });
};

export default {getAll, create, deletePerson, update};