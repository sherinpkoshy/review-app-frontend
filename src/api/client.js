import axios from "axios";

const client = axios.create({
  baseURL: "https://cyan-squid-kilt.cyclic.app/api",
});
export default client;
