export const formatToNumberString = number => {
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const formatToVND = number => {
	return `${(number || 0)
		.toFixed(0)
		.toString()
		.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}đ`;
};

export const formatToVNDate = (date, type) => {
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
