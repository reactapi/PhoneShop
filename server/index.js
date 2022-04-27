require('dotenv').config();
const argon2 = require('argon2');

// Mongoose
const mongoose = require('mongoose');
const connectDB = async () => {
	try {
		await mongoose.connect(
			'mongodb+srv://vhungitm:vanhung1998@phoneshop.w4zov.mongodb.net/PhoneShop?retryWrites=true&w=majority'
		);

		checkUserGroup();
		console.log('Đã kết nối với MongoDB!');
	} catch (error) {
		console.log('Không thể kết nối với MongoDB!');
	}
};

const checkUserGroup = async () => {
	try {
		// Check customer group
		let group = await UserGroup.findOne({ name: 'CUSTOMER' });

		if (!group) {
			const customerGroup = new UserGroup({
				name: 'CUSTOMER'
			});

			await customerGroup.save();
		}

		// Check admin group
		group = await UserGroup.findOne({ name: 'ADMIN' });

		if (!group) {
			const adminGroup = new UserGroup({
				name: 'ADMIN'
			});

			await adminGroup.save();
		}

		// Check admin user
		const user = await User.findOne({ username: 'admin' });

		if (!user) {
			const hashedPassword = await argon2.hash('12345678');
			const adminGroupId = (await UserGroup.findOne({ name: 'ADMIN' }))
				._id;

			const adminUser = new User({
				username: 'admin',
				password: hashedPassword,
				userGroup: adminGroupId.toString(),
				name: 'Admin',
				gender: 'Nam',
				dateOfBirth: '1998-11-21',
				address: 'TDM, Bình Dương',
				phone: '0385968197',
				email: 'admin@gmail.com',
				status: true
			});

			await adminUser.save();
		}
	} catch (error) {
		console.log(error);
		console.log('Lỗi kiểm tra nhóm tài khoản');
	}
};

connectDB();

// Express
const express = require('express');
const app = express();
const PORT = 5000;
const cors = require('cors');

app.use(cors());
app.use(express.json());

// Router
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const uploadRouter = require('./routes/upload');
const categoryRouter = require('./routes/category');
const phoneRouter = require('./routes/phone');
const orderRouter = require('./routes/order');
const discountRouter = require('./routes/discount');
const feedbackRouter = require('./routes/feedback');
const bannerRouter = require('./routes/banner');
const UserGroup = require('./models/UserGroup');
const User = require('./models/User');

app.use(express.static('public'));
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/phones', phoneRouter);
app.use('/api/uploads', uploadRouter);
app.use('/api/orders', orderRouter);
app.use('/api/discounts', discountRouter);
app.use('/api/feedbacks', feedbackRouter);
app.use('/api/banners', bannerRouter);

// Listen
app.listen(PORT, () => console.log(`Đã kết nối với cổng ${PORT}!`));
