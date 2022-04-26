const express = require('express');
const User = require('../models/User');
const router = express.Router();
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const UserGroup = require('../models/UserGroup');
const verifyToken = require('../middleware/auth');

router.get('/', verifyToken, async (req, res) => {
	try {
		const user = await User.findById(req.userId).populate('userGroup').select('-password');

		// Check for user exists
		if (!user)
			return res.status(400).json({
				status: false,
				message: 'Không tìm thấy người dùng!'
			});

		// All good
		return res.json({
			status: true,
			user
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			status: false,
			message: 'Lỗi máy chủ!'
		});
	}
});

// @route /api/auth/login
// @desc Login user
// @access Public
router.post('/login', async (req, res) => {
	try {
		const { username, password, userGroup } = req.body;

		// Check username
		const user = (
			await User.find({
				$or: [{ username: username }, { phone: username }, { email: username }]
			}).populate('userGroup')
		)[0];

		if (!user)
			return res.status(400).json({
				status: false,
				message: 'Sai tên tài khoản hoặc mật khẩu!'
			});

		// Check password
		const passwordValid = await argon2.verify(user.password, password);

		if (!passwordValid)
			return res.status(400).json({
				status: false,
				message: 'Sai tên tài khoản hoặc mật khẩu!'
			});

		// Check permission
		if (userGroup && user.userGroup.name !== userGroup)
			return res.status(400).json({
				status: false,
				message: 'Sai tên tài khoản hoặc mật khẩu!'
			});

		// Check status
		if (!user.status)
			return res.status(400).json({
				status: false,
				message:
					'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ với người quản trị để được hỗ trợ!'
			});

		// All good
		const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET);
		return res.json({
			status: true,
			message: 'Đăng nhập thành công!',
			accessToken
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			status: false,
			message: 'Lỗi máy chủ!'
		});
	}
});

// @route POST /api/auth/register
// @desc Register user
// @access Public
router.post('/register', async (req, res) => {
	try {
		const { username, password, avatar, name, gender, dateOfBirth, address, phone, email } =
			req.body;

		// Check username
		const usernameValid = !(await User.findOne({ username }));

		if (!usernameValid)
			return res.status(400).json({
				status: false,
				message: 'Tên người dùng đã tồn tại!'
			});

		// Check phone
		const phoneValid = !(await User.findOne({ phone }));

		if (!phoneValid)
			return res.status(400).json({
				status: false,
				message: 'Số điện thoại này đã được ai đó sử dụng!'
			});

		// Check email
		const emailValid = !(await User.findOne({ email }));

		if (!emailValid)
			return res.status(400).json({
				status: false,
				message: 'Email này đã được ai đó sử dụng!'
			});

		// All good
		// Add new user
		const customerGroup = await UserGroup.findOne({ name: 'CUSTOMER' });
		const hashedPassword = await argon2.hash(password);
		const newUser = new User({
			username,
			password: hashedPassword,
			avatar,
			userGroup: customerGroup._id,
			name,
			gender,
			dateOfBirth,
			address,
			phone,
			email
		});

		await newUser.save();

		// Access token
		const accessToken = jwt.sign({ userId: newUser._id }, process.env.ACCESS_TOKEN_SECRET);

		// Return
		return res.json({
			status: true,
			message: 'Đăng ký tài khoản thành công!',
			accessToken
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			status: false,
			message: 'Lỗi máy chủ!'
		});
	}
});

module.exports = router;
