const express = require('express');
const Discount = require('../models/Discount');
const router = express.Router();

// @route GET /api/discounts
// @desc Get discounts
// @access Public
router.get('/', async (req, res) => {
	try {
		const { key, code, status } = req.query;

		// Query
		let query = {};

		if (key) query = { name: new RegExp(key, 'i') };
		if (code) query = { ...query, code: new RegExp(code, 'i') };
		if (status !== undefined) query = { ...query, status };

		// Pagination
		let { _page, _limit } = req.query;

		_page = !_page && _limit ? 1 : parseInt(_page);
		_limit = _page && !_limit ? 5 : parseInt(_limit);

		const _skip = _page ? (_page - 1) * _limit : undefined;
		const _totalRows = await Discount.count(query);
		const pagination = _page ? { _page, _limit, _totalRows } : undefined;

		const discounts = await Discount.find(query).skip(_skip).limit(_limit);

		// Return
		return res.json({
			status: true,
			data: discounts,
			pagination
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			status: true,
			message: 'Lỗi máy chủ! Lấy danh sách phiếu giảm giá không thành công!'
		});
	}
});

// @route GET /api/discounts
// @desc Get discount
// @access Public
router.get('/:code', async (req, res) => {
	try {
		const { code } = req.params;

		const discount = await Discount.findOne({ code });

		if (!discount)
			return res.status(400).json({
				status: false,
				message: 'Không tìm thấy phiếu giảm giá!'
			});

		// All good
		return res.json({
			status: true,
			discount
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			status: false,
			message: 'Lỗi máy chủ! Lấy thông tin phiếu giảm giá không thành công!'
		});
	}
});

// @route POST /api/discounts
// @desc Add discount
// @access Private
router.post('/', async (req, res) => {
	try {
		const { code, name, quantity, price, status } = req.body;

		// Check code
		const codeValid = !(await Discount.findOne({ code }));

		if (!codeValid)
			return res.status(400).json({
				status: false,
				message: 'Mã giảm giá đã tồn tại!'
			});

		// All good
		const newDiscount = new Discount({
			code,
			name,
			quantity,
			price,
			status
		});

		await newDiscount.save();

		// Return
		return res.json({
			status: true,
			message: 'Thêm mới phiếu giảm giá thành công!',
			discount: newDiscount
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			status: false,
			message: 'Lỗi máy chủ! Thêm mới phiếu giảm giá không thành công!'
		});
	}
});

// @route PUT /api/discounts
// @desc Update discount
// @access Private
router.put('/:id', async (req, res) => {
	try {
		// Check for discount exists
		const { id } = req.params;

		const discountValid = await Discount.findById(id);

		if (!discountValid)
			return res.status(400).json({
				status: false,
				message: 'Không tìm thấy phiếu giảm giá!'
			});

		// Get new data
		const { code, name, quantity, price, status } = req.body;

		// Check for code exists
		if (code) {
			const codeValid = !(await Discount.findOne({
				$and: [{ _id: { $ne: id } }, { code }]
			}));

			if (!codeValid)
				return res.status(400).json({
					status: false,
					message: 'Mã phiếu giảm giá đã tồn tại!'
				});
		}

		// All good
		const updatedDiscount = await Discount.findByIdAndUpdate(
			id,
			{
				code,
				name,
				quantity,
				price,
				status
			},
			{ new: true }
		);

		// Return
		return res.json({
			status: true,
			message: 'Cập nhật thông tin phiếu giảm giá thành công!',
			discount: updatedDiscount
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			status: false,
			message: 'Lỗi máy chủ! Cập nhật thông tin phiếu giảm giá không thành công!'
		});
	}
});

// @route DELETE /api/discount
// @desc Delete discount
// @access Private
router.delete('/:id', async (req, res) => {
	try {
		// Check for discount exists
		const { id } = req.params;
		const discountValid = await Discount.findById(id);

		if (!discountValid)
			return res.status(400).json({
				status: false,
				message: 'Không tìm thấy phiếu giảm giá!'
			});

		// All good
		const deletedDiscount = await Discount.findByIdAndDelete(id);

		return res.json({
			status: true,
			message: `Xóa phiếu giảm giá ${deletedDiscount.name} thành công!`,
			discount: deletedDiscount
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			status: false,
			message: 'Lỗi máy chủ! Xóa phiếu giảm giá không thành công!'
		});
	}
});

module.exports = router;
