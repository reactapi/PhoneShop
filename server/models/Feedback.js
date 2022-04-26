const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeedbackSchema = new Schema({
	name: { type: String, required: true },
	phone: { type: String, required: true },
	email: { type: String, required: true },
	content: { type: String, required: true },
	status: { type: Boolean, required: true, default: false }
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
