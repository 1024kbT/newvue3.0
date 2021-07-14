import axios from "./axios";
import url from "./index";
const server = {
    //新增人员
    getAddList(data) {
        return axios("/sort/insertPersonAndMoveBack", {
            method: "post",
            data,
        });
    },
    //删除人员
    getDeleteList(data) {
        return axios("/sort/delPersonAndForward", {
            method: "post",
            data,
        });
    },
    getLists() {
        return axios("/confOrg/insertOrgFromExcel", {
            method: "Post",
        });
    },
    //文件上传
    getPeoples(data) {
        return axios("/confOrg/insertOrgFromExcel", {
            method: "post",
            data,
        });
    },
    getPeople(data) {
        return axios("/sort/insertPerson", {
            method: "post",
            data,
        });
    },
    postMould(data) {
        return axios("/sortTemplate/addSortTemplate", {
            method: "post",
            data,
        });
    },
    getDistributeData(params) {
        return axios("/confLayout/findAllByConferenceId", {
            method: "get",
            params,
        });
    },
    getNewDistributions(params) {
        return axios("/conference/findConferenceByIdAndConfLayoutId", {
            method: "get",
            params,
        });
    },
    getSort(data) {
        return axios("/sort/sortSeat", {
            method: "post",
            data,
        });
    },
    saveConference(data) {
        return axios("/conferenceProcess/save", {
            method: "post",
            data,
        });
    },
    getSortMudle(params) {
        return axios("/sortTemplate/findAllSortTemplateByLayoutId", {
            method: "get",
            params,
        });
    },
    getSortList() {
        return axios("/sort/findAllSortRule", {
            method: "get",
        });
    },
    //移动端
    getMobileList(id) {
        return axios("/conferenceProcess/findById?id=" + id, {
            method: "get",
        });
    },
};

export default server;
