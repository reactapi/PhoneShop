import axiosClient from './axiosClient';

const apiUrl = '/uploads/';
const updateApi = {
	fetchList(type) {
		const url = apiUrl + type;

		return axiosClient.get(url);
	},

	upload(params) {
		const { type, file } = params;
		const url = apiUrl + type;

		const formData = new FormData();
		formData.append('upload', file);

		return axiosClient.post(url, formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		});
	},

	update(params) {
		const { type, fileName, newFileName } = params;
		const url = apiUrl + type + '/' + fileName;

		return axiosClient.put(url, { name: newFileName });
	},

	remove(params) {
		const { type, fileName } = params;
		const url = apiUrl + type + '/' + fileName;

		return axiosClient.delete(url);
	}
};

export default updateApi;
