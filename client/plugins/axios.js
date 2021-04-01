import axios from "axios";

export default axios.create({

    baseURL: "http://192.168.195.98:3333/api/v1",
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
    }
});