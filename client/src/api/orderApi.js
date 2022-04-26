import axiosClient from './axiosClient';

const apiUrl = '/orders';

const orderApi = {
	fetch(params) {
		const { key, user, phone, status, _page, _limit } = params;

		// Url
		let url = apiUrl;

		if (key) url += `&key=${key}`;
		if (user) url += `&user=${user}`;
		if (phone) url += `&phone=${phone}`;
		if (status !== undefined) url += `&status=${status}`;
		if (_page) url += `&_page=${_page}`;
		if (_limit) url += `&_limit=${_limit}`;

		url = url.replace(`${apiUrl}&`, `${apiUrl}?`);

		// Return
		return axiosClient.get(url);
	},

	fetchTopCustomers(_limit) {
		const url = `${apiUrl}/topcustomers?_limit=${_limit}`;

		return axiosClient.get(url);
	},

	fetchTopPhones(_limit) {
		const url = `${apiUrl}/topphones?_limit=${_limit}`;

		return axiosClient.get(url);
	},

	add(params) {
		return axiosClient.post(apiUrl, params);
	},

	update(params) {
		const url = `${apiUrl}/${params._id}`;

		return axiosClient.put(url, params);
	}
};

export default orderApi;
