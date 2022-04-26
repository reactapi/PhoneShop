const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const OrderDetailSchema = new Schema({
	phone: { type: ObjectId, ref: 'Phone', required: true },
	rom: { type: String, required: true },
	ram: { type: String, required: true },
	color: { type: String, required: true },
	quantity: { type: Number, required: true, min: 1 },
	price: { type: Number, required: true, min: 0 }
});

const OrderSchema = new Schema({
	user: { type: ObjectId, ref: 'User', required: true },
	phone: { type: String, required: true },
	address: { type: String, required: true },
	details: [OrderDetailSchema],
	createdDate: { type: Date, default: new Date() },
	totalPrice: { type: Number, default: 0, min: 0 },
	shipPrice: { type: Number, default: 0, min: 0 },
	discountPrice: { type: Number, default: 0, min: 0 },
	finalPrice: { type: Number, default: 0, min: 0 },
	status: { type: Boolean, default: false }
});

module.exports = mongoose.model('Order', OrderSchema);
