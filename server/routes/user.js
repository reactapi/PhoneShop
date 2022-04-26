const express = require('express');
const User = require('../models/User');
const UserGroup = require('../models/UserGroup');
const router = express.Router();
const argon2 = require('argon2');

// @route GET /api/users
// @desc Get all users
// @access Private
router.get('/', async (req, res) => {
	try {
		const { key, userGroup, status } = req.query;

		// Query
		let query = {};

		if (key) query = { name: new RegExp(key, 'i') };
		if (userGroup) {
			const userGroupId = (await UserGroup.findOne({ name: userGroup }))
				?._id;
			query = { ...query, userGroup: userGroupId };
		}
		if (status !== undefined) query = { ...query, status };

		// Pagination
		let { _page, _limit } = req.query;

		_page = !_page && _limit ? 1 : parseInt(_page);
		_limit = _page && !_limit ? 5 : parseInt(_limit);

		const _skip = _page ? (_page - 1) * _limit : undefined;
		const _totalRows = await User.count(query);
		const pagination = _page ? { _page, _limit, _totalRows } : undefined;

		const users = await User.find(query)
			.populate('userGroup')
			.skip(_skip)
			.limit(_limit);

		// Return
		return res.json({
			status: true,
			data: users,
			pagination
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			status: false,
			message: 'Lỗi hệ thống! Lấy danh sách người dùng không thành công!'
		});
	}
});

// @route POST /api/users
// @desc Add user
// @access Private
router.post('/', async (req, res) => {
	try {
		const {
			username,
			password,
			avatar,
			userGroup,
			name,
			gender,
			dateOfBirth,
			address,
			phone,
			email,
			status
		} = req.body;

		// Check username
		const usernameValid = !(await User.findOne({ username }));

		if (!usernameValid)
			return res.status(400).json({
				status: false,
				message: 'Tên tài khoản đã tồn tại!'
			});

		// Check phone
		const phoneValid = !(await User.findOne({ phone }));

		if (!phoneValid)
			return res.status(400).json({
				status: false,
				message: 'Số điện thoại này đã được người khác sử dụng!'
			});

		// Check email
		const emailValid = !(await User.findOne({ email }));

		if (!emailValid)
			return res.status(400).json({
				status: false,
				message: 'Email này đã được người khác sử dụng!'
			});

		// Check user group
		const userGroupValid = await UserGroup.findOne({ name: userGroup });

		if (!userGroupValid)
			return res.status(400).json({
				status: false,
				message: 'Nhóm tài khoản không hợp lệ!'
			});

		// All good
		const hashedPassword = await argon2.hash(password);

		const newUser = new User({
			username,
			password: hashedPassword,
			avatar,
			userGroup: userGroupValid._id,
			name,
			gender,
			dateOfBirth,
			address,
			phone,
			email,
			status
		});

		await newUser.save();

		// Return
		return res.json({
			status: true,
			message: 'Thêm mới người dùng thành công!',
			user: newUser
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			status: false,
			message: 'Lỗi máy chủ! Thêm mới người dùng không thành công!'
		});
	}
});

// @route PUT /api/user
// @desc Update user
// @access Private
router.put('/:id', async (req, res) => {
	try {
		// Check user exists
		const { id } = req.params;

		const userValid = await User.findById(id);

		if (!userValid)
			return res.status(400).json({
				status: false,
				message: 'Không tìm thấy người dùng!'
			});

		// New data
		const {
			username,
			password,
			avatar,
			userGroup,
			name,
			gender,
			dateOfBirth,
			address,
			phone,
			email,
			status
		} = req.body;

		// Check username
		const usernameValid = !(await User.findOne({
			_id: { $ne: id },
			username
		}));

		if (!usernameValid)
			return res.status(400).json({
				status: false,
				message: 'Tên tài khoản đã tồn tại!'
			});

		// Check phone
		const phoneValid = !(await User.findOne({ _id: { $ne: id }, phone }));

		if (!phoneValid)
			return res.status(400).json({
				status: false,
				message: 'Số điện thoại này đã được người khác sử dụng!'
			});

		// Check email
		const emailValid = !(await User.findOne({ _id: { $ne: id }, email }));

		if (!emailValid)
			return res.status(400).json({
				status: false,
				message: 'Email này đã được người khác sử dụng!'
			});

		// Check user group
		const userGroupValid = userGroup
			? await UserGroup.findOne({ name: userGroup })
			: true;

		if (!userGroupValid)
			return res.status(400).json({
				status: false,
				message: 'Loại tài khoản không hợp lệ!'
			});

		// All good
		const hashedPassword = await argon2.hash(password || '');

		const updatedUser = await User.findByIdAndUpdate(
			id,
			{
				username,
				password: password ? hashedPassword : undefined,
				avatar,
				userGroup: userGroup ? userGroupValid._id : undefined,
				name,
				gender,
				dateOfBirth,
				address,
				phone,
				email,
				status
			},
			{ new: true }
		).populate('userGroup');

		// Return
		return res.json({
			status: true,
			message: 'Cập nhật thông tin người dùng thành công!',
			user: updatedUser
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			status: false,
			message:
				'Lỗi máy chủ! Cập nhật thông tin người dùng không thành công!'
		});
	}
});

// @route DELETE /api/user
// @desc Delete user
// @access Private
router.delete('/:id', async (req, res) => {
	try {
		// Check user exists
		const { id } = req.params;

		const userValid = await User.findById(id);

		if (!userValid)
			return res.status(400).json({
				status: false,
				message: 'Không tìm thấy người dùng!'
			});

		// All good
		const deletedUser = await User.findByIdAndDelete(id);

		return res.json({
			status: true,
			message: `Xóa người dùng ${deletedUser.name} thành công!`,
			user: deletedUser
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			status: false,
			message: 'Lỗi máy chủ! Xóa người dùng không thành công!'
		});
	}
});

module.exports = router;
