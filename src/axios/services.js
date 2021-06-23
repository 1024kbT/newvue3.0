import axios from "./axios";
import url from "./index";
const server = {
    getLists() {
        return axios("/conference/findAllPerson", {
            method: "get",
        });
    },
    getDistributeData() {
        return axios("/conference/findByConfId/1", {
            method: "get",
        });
    },
    getSort(data) {
        return axios("/conference/sort", {
            method: "post",
            data,
        });
    },
    getPeople(data) {
        return axios("/conference/insertPerson", {
            method: "post",
            data,
        });
    },
    getNoPeople() {
        return axios("/conference/generatePerson", {
            method: "post",
        });
    },
};

export default server;
