import axios from 'axios';
import queryString from 'query-string';

const axiosClient = axios.create({
	baseURL: process.env.REACT_APP_API_URL,
	headers: {
		'content-type': 'application/json'
	},
	paramsSerializer: params => queryString.stringify(params)
});

axiosClient.interceptors.request.use(async config => {
	const token = localStorage.getItem('accessToken');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

axiosClient.interceptors.response.use(
	response => {
		if (response && response.data) {
			return response.data;
		}
		return response;
	},
	error => {
		if (error && error.response && error.response.data) {
			return error.response.data;
		}
		return error;
	}
);

export default axiosClient;
