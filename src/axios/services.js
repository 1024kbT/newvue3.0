import axios from './axios';
import url from './index';
const server = {
    getDistributeData() { 
        return axios('/conference/findByConfId/1', {
            method: 'get'
        })
    },
	getSort(data) { 
	    return axios('/conference/sort', {
	        method: 'post',
	        data
	    })
	},
	getPeople(data) {
	    return axios('/conference/insertPerson', {
	        method: 'post',
	        data
	    })
	}
};

export default server;
