import axios from "axios";

// https://cyan-squid-kilt.cyclic.app/api
const client = axios.create({
  baseURL: "https://cyan-squid-kilt.cyclic.app/api",
});
export default client;
