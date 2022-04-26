import address from './address';

const addressApi = {
	fetchCities() {
		const cities = address.map(x => ({ id: x.id, name: x.name, code: x.code }));
		return cities;
	},

	fetchDistricts(cityCode) {
		const index = address.findIndex(x => x.code === cityCode);
		const districts = address[index]?.districts?.map(x => ({ id: x.id, name: x.name }));

		return districts;
	},

	fetchWards(cityCode, districtId) {
		const cityIndex = address.findIndex(x => x.code === cityCode);
		const districtIndex = address[cityIndex]?.districts?.findIndex(x => x.id === districtId);
		const wards = address[cityIndex]?.districts[districtIndex]?.wards?.map(x => ({
			id: x.id,
			name: x.name,
			prefix: x.prefix
		}));

		return wards;
	},

	fetchStreets(cityCode, districtId) {
		const cityIndex = address.findIndex(x => x.code === cityCode);
		const districtIndex = address[cityIndex]?.districts?.findIndex(x => x.id === districtId);
		const streets = address[cityIndex]?.districts[districtIndex]?.streets?.map(x => ({
			id: x.id,
			name: x.name,
			prefix: x.prefix
		}));

		return streets;
	}
};

export default addressApi;
