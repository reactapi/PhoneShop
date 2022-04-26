const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BannerSchema = new Schema({
	title: { type: String, required: true },
	image: { type: String, required: true },
	url: { type: String, required: true },
	order: { type: Number, required: true, default: 1 },
	status: { type: Boolean, required: true, default: true }
});

module.exports = mongoose.model('Banner', BannerSchema);
