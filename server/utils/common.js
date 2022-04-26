const convertToMetaTilte = str => {
	return str
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/đ/g, 'd')
		.replace(/Đ/g, 'd')
		.replace(/[^a-zA-Z0-9 ]/g, '')
		.replace(/\s+/g, ' ')
		.replace(/[\ ]/g, '-')
		.toLowerCase();
};

const formatToVNDate = (date, type) => {
	// Day
	let day = date.getDate();
	if (day < 10) day = `0${day}`;

	// Month
	let month = date.getMonth() + 1;
	if (month < 10) month = `0${month}`;

	// Year
	const year = date.getFullYear();

	let result = '';
	switch (type) {
		case 'yyyy-MM-dd': {
			result = `${year}-${month}-${day}`;
			break;
		}
		default: {
			// VN Date
			result = `${day}/${month}/${year}`;
		}
	}

	return result;
};

function skip(_skip) {
	if (!_skip) return this;

	return this.filter((item, index) => {
		if (index > _skip - 1) {
			return true;
		}
	});
}

function limit(_limit) {
	if (!_limit) return this;

	return this.filter((item, index) => {
		if (index <= _limit - 1) {
			return true;
		}
	});
}

Array.prototype.skip = skip;
Array.prototype.limit = limit;

module.exports = { convertToMetaTilte, formatToVNDate, skip, limit };
