require('dotenv').config();

// Mongoose
const mongoose = require('mongoose');
const connectDB = async () => {
	try {
		await mongoose.connect('mongodb://localhost:27017/PhoneShop');
		console.log('Đã kết nối với MongoDB!');
	} catch (error) {
		console.log('Không thể kết nối với MongoDB!');
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
