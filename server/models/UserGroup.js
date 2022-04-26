const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserGroupSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true
	}
});

module.exports = mongoose.model('UserGroup', UserGroupSchema);
