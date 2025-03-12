import axios from "axios";

export default () =>
  axios.post("http://localhost:8081")
  .then(response => {
    return response?.data?.sessionId;
  })
  .catch(error => {
    console.error(error);
  });