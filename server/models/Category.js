const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const CategorySchema = new Schema({
	name: { type: String, required: true, unique: true },
	metaTitle: { type: String, required: true, unique: true },
	parent: { type: ObjectId, ref: 'Category' },
	status: { type: Boolean, required: true, default: true }
});

module.exports = mongoose.model('Category', CategorySchema);
