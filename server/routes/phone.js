const express = require('express');
const Category = require('../models/Category');
const Phone = require('../models/Phone');
const { convertToMetaTilte } = require('../utils');
const router = express.Router();

// @route GET /api/phones
// @desc Get categories
// @access Public
router.get('/', async (req, res) => {
	try {
		const { key, category, status } = req.query;

		// Query
		let query = {};

		if (key) query = { name: new RegExp(key, 'i') };
		if (category) query = { ...query, category };
		if (status !== undefined) query = { ...query, status };

		// Pagination
		let { _page, _limit } = req.query;

		_page = !_page && _limit ? 1 : parseInt(_page);
		_limit = _page && !_limit ? 5 : parseInt(_limit);

		const _skip = _page ? (_page - 1) * _limit : undefined;
		const _totalRows = await Phone.count(query);
		const pagination = _page ? { _page, _limit, _totalRows } : undefined;

		const data = await Phone.find(query).populate('category').skip(_skip).limit(_limit);

		// Return
		return res.json({
			status: true,
			data,
			pagination
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			status: false,
			message: 'Lỗi máy chủ!'
		});
	}
});

// @route GET /api/phones
// @desc Get phone
// @access Public
router.get('/:metaTitle', async (req, res) => {
	try {
		const { metaTitle } = req.params;

		const phone = await Phone.findOne({ metaTitle }).populate('category');

		if (!phone)
			return res.status(400).json({
				status: false,
				message: 'Không tìm thấy điện thoại!'
			});

		// All good
		return res.json({
			status: true,
			data: phone
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			status: false,
			message: 'Lỗi máy chủ! Lấy thông tin điện thoại không thành công!'
		});
	}
});

// @route POST /api/phones
// @desc Add phone
// @access Private
router.post('/', async (req, res) => {
	try {
		const {
			name,
			category,
			roms,
			rams,
			colors,
			models,
			photos,
			promotionPrice,
			description,
			status
		} = req.body;
		const metaTitle = convertToMetaTilte(name);

		// Check metaTitle
		const metaTitleValid = !(await Phone.findOne({ metaTitle }));

		if (!metaTitleValid)
			return res.status(400).json({
				status: false,
				message: 'Tên điện thoại hoặc Meta Title đã tồn tại!'
			});

		// Check for category exists
		const categoryValid = await Category.findById(category);

		if (!categoryValid)
			return res.status(400).json({
				status: false,
				message: 'Không tìm thấy danh mục!'
			});

		// All good
		const newPhone = new Phone({
			name,
			metaTitle,
			category,
			roms,
			rams,
			colors,
			models,
			photos,
			promotionPrice,
			description,
			status
		});

		await newPhone.save();

		// Return
		return res.json({
			status: true,
			message: 'Thêm mới điện thoại thành công!',
			phone: newPhone
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			status: false,
			message: 'Lỗi máy chủ! Thêm mới điện thoại không thành công!'
		});
	}
});

// @route PUT /api/phones/:id
// @desc Update phone
// @access Private
router.put('/:id', async (req, res) => {
	try {
		// Check for phone exists
		const { id } = req.params;
		const phoneValid = await Phone.findById(id);

		if (!phoneValid)
			return res.status(400).json({
				status: false,
				message: 'Không tìm thấy điện thoại!'
			});

		// Get new data
		const {
			name,
			category,
			rams,
			roms,
			colors,
			models,
			photos,
			promotionPrice,
			description,
			status
		} = req.body;
		const metaTitle = name ? convertToMetaTilte(name) : undefined;

		// Check metaTitle
		if (name) {
			const metaTitleValid = !(await Phone.findOne({
				_id: { $ne: id },
				metaTitle
			}));

			if (!metaTitleValid)
				return res.status(400).json({
					status: false,
					message: 'Tên điện thoại hoặc Meta Title đã tồn tại!'
				});
		}

		// All good
		const updatedPhone = await Phone.findByIdAndUpdate(
			id,
			{
				name,
				metaTitle,
				category,
				roms,
				rams,
				colors,
				models,
				photos,
				promotionPrice,
				description,
				status
			},
			{ new: true }
		).populate('category');

		// Return
		return res.json({
			status: true,
			message: 'Cập nhật thông tin điện thoại thành công!',
			phone: updatedPhone
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			status: false,
			message: 'Lỗi máy chủ! Cập nhật thông tin điện thoại không thành công!'
		});
	}
});

// @route DELETE /api/phones/:id
// @desc Delete phone
// @access Private
router.delete('/:id', async (req, res) => {
	try {
		// Check for phone exists
		const { id } = req.params;
		const phoneValid = await Phone.findById(id);

		if (!phoneValid)
			return res.status(400).json({
				status: false,
				message: 'Không tìm thấy điện thoại!'
			});

		// All good
		const deletedPhone = await Phone.findByIdAndDelete(id);

		return res.json({
			status: true,
			message: `Xóa điện thoại ${deletedPhone.name} thành công!`,
			phone: deletedPhone
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			status: false,
			message: 'Lỗi máy chủ! Xóa điện thoại không thành công!'
		});
	}
});

module.exports = router;
