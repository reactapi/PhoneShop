const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const UserSchema = new Schema({
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	avatar: { type: String, required: true, default: '/images/no-avatar.png' },
	userGroup: { type: ObjectId, required: true, ref: 'UserGroup' },
	name: { type: String, required: true },
	gender: { type: String, required: true, enum: ['Nam', 'Nữ'], default: 'Nam' },
	dateOfBirth: { type: Date, required: true },
	address: { type: String },
	phone: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	status: { type: Boolean, default: true }
});

module.exports = mongoose.model('User', UserSchema);
