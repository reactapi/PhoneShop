const express = require('express');
const Category = require('../models/Category');
const Feedback = require('../models/Feedback');
const { convertToMetaTilte } = require('../utils');
const router = express.Router();

// @route GET /api/feedbacks
// @desc Get feedbacks
// @access Public
router.get('/', async (req, res) => {
	try {
		const { key, status } = req.query;

		// Query
		let query = {};

		if (key)
			query = {
				$or: [
					{ name: new RegExp(key, 'i') },
					{ phone: new RegExp(key, 'i') },
					{ email: new RegExp(key, 'i') }
				]
			};
		if (status !== undefined) query = { ...query, status };

		// Pagination
		let { _page, _limit } = req.query;

		_page = !_page && _limit ? 1 : parseInt(_page);
		_limit = _page && !_limit ? 5 : parseInt(_limit);

		const _skip = _page ? (_page - 1) * _limit : undefined;
		const _totalRows = await Category.count(query);
		const pagination = _page ? { _page, _limit, _totalRows } : undefined;

		const feedbacks = await Feedback.find(query).skip(_skip).limit(_limit);

		// Return
		return res.json({
			status: true,
			data: feedbacks,
			pagination
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			status: false,
			message: 'Lỗi máy chủ! Lấy danh sách phản hồi không thành công!'
		});
	}
});

// @route GET /api/feedbacks
// @desc Get feedback
// @access Public
router.get('/:id', async (req, res) => {
	try {
		const { id } = req.params;

		const feedback = await Feedback.findById(id);

		if (!feedback)
			return res.status(400).json({
				status: false,
				message: 'Không tìm thấy phản hồi!'
			});

		// All good
		return res.json({
			status: true,
			feedback
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			status: false,
			message: 'Lỗi máy chủ! Lấy thông tin phản hồi không thành công!'
		});
	}
});

// @route POST /api/feedbacks
// @desc Add feedback
// @access Private
router.post('/', async (req, res) => {
	try {
		const { name, phone, email, content } = req.body;

		// All good
		const newFeedback = new Feedback({
			name,
			phone,
			email,
			content
		});

		await newFeedback.save();

		// Return
		return res.json({
			status: true,
			message: 'Gửi phản hồi thành công!',
			feedback: newFeedback
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			status: false,
			message: 'Lỗi máy chủ! Gửi phản hồi không thành công!'
		});
	}
});

// @route PUT /api/feedbacks/:id
// @desc Update feedback
// @access Private
router.put('/:id', async (req, res) => {
	try {
		// Check feedback exists
		const { id } = req.params;

		const feedbackValid = await Feedback.findById(id);

		if (!feedbackValid)
			return res.status(400).json({
				status: false,
				message: 'Không tìm thấy phản hồi!'
			});

		// All good
		const updatedFeedback = await Feedback.findByIdAndUpdate(
			id,
			{
				status: true
			},
			{ new: true }
		);

		// Return
		return res.json({
			status: true,
			message: 'Cập nhật thông tin phản hồi thành công!',
			feedback: updatedFeedback
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			status: false,
			message:
				'Lỗi máy chủ! Cập nhật thông tin phản hồi không thành công!'
		});
	}
});

// @route DELETE /api/feedbacks/:id
// @desc Delete feedback
// @access Private
router.delete('/:id', async (req, res) => {
	try {
		// Check for category exists
		const { id } = req.params;
		const feedbackValid = await Feedback.findById(id);

		if (!feedbackValid)
			return res.status(400).json({
				status: false,
				message: 'Không tìm thấy phản hồi!'
			});

		// All good
		const deletedFeedback = await Feedback.findByIdAndDelete(id);

		return res.json({
			status: true,
			message: `Xóa phản hồi thành công!`,
			feedback: deletedFeedback
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			status: false,
			message: 'Lỗi máy chủ! Xóa phản hồi không thành công!'
		});
	}
});

module.exports = router;
