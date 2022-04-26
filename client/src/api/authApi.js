import axiosClient from './axiosClient';

const authApi = {
	getMe() {
		const url = `/auth`;

		return axiosClient.get(url);
	},

	login(params) {
		const url = '/auth/login';

		return axiosClient.post(url, params);
	},

	register(params) {
		const url = '/auth/register';

		return axiosClient.post(url, params);
	}
};

export default authApi;
