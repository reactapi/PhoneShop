const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DiscountSchema = new Schema({
	code: { type: String, required: true, unique: true },
	name: { type: String, required: true },
	quantity: { type: Number, required: true, default: 0 },
	price: { type: Number, required: true, default: 0 },
	status: { type: Boolean, required: true, default: false }
});

module.exports = mongoose.model('Discount', DiscountSchema);
