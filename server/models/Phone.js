const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const PhonePhotoSchema = new Schema({
	title: { type: String, required: true },
	url: {
		type: String,
		default: '/images/no-phone-photo.png'
	}
});

const PhoneSchema = new Schema({
	name: { type: String, unique: true },
	metaTitle: { type: String, required: true, unique: true },
	category: { type: ObjectId, ref: 'Category', required: true },
	rams: {
		type: [String],
		validate: function (value) {
			return value.length > 0;
		}
	},
	roms: {
		type: [String],
		validate: function (value) {
			return value.length > 0;
		}
	},
	colors: {
		type: [String],
		validate: function (value) {
			return value.length > 0;
		}
	},
	models: {
		type: [
			{
				rom: { type: String, required: true },
				ram: { type: String, required: true },
				color: { type: String, required: true },
				quantity: { type: Number, default: 0, min: 0 },
				price: { type: Number, default: 0, min: 0 }
			}
		],
		validate: function (value) {
			return value.length > 0;
		}
	},
	photos: {
		type: [PhonePhotoSchema],
		validate: function (value) {
			return value.length >= 0;
		}
	},
	promotionPrice: Number,
	description: String,
	status: { type: Boolean, default: true }
});

module.exports = mongoose.model('Phone', PhoneSchema);
