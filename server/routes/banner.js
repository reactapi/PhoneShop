const express = require('express');
const Banner = require('../models/Banner');
const router = express.Router();

// @route GET /api/banners
// @desc Get banners
// @access Public
router.get('/', async (req, res) => {
	try {
		const { key, status } = req.query;

		// Query
		let query = {};

		if (key) query = { title: new RegExp(key, 'i') };
		if (status !== undefined) query = { ...query, status };

		// Pagination
		let { _page, _limit } = req.query;

		_page = !_page && _limit ? 1 : parseInt(_page);
		_limit = _page && !_limit ? 5 : parseInt(_limit);

		const _skip = _page ? (_page - 1) * _limit : undefined;
		const _totalRows = await Banner.count(query);
		const pagination = _page ? { _page, _limit, _totalRows } : undefined;

		const banners = await Banner.find(query)
			.sort('order')
			.skip(_skip)
			.limit(_limit);

		// Return
		return res.json({
			status: true,
			data: banners,
			pagination
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			status: false,
			message:
				'Lỗi máy chủ! Lấy danh sách bìa quảng cáo không thành công!'
		});
	}
});

// @route GET /api/banners/:id
// @desc Get banner
// @access Public
router.get('/:id', async (req, res) => {
	try {
		const { id } = req.params;

		const banner = await Banner.findById(id);

		if (!banner)
			return res.status(400).json({
				status: false,
				message: 'Không tìm thấy bìa quảng cáo!'
			});

		// All good
		return res.json({
			status: true,
			banner
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			status: false,
			message:
				'Lỗi máy chủ! Lấy thông tin bìa quảng cáo không thành công!'
		});
	}
});

// @route POST /api/banners
// @desc Add banner
// @access Private
router.post('/', async (req, res) => {
	try {
		const { title, image, url, order, status } = req.body;

		// All good
		const newBanner = new Banner({
			title,
			image,
			url,
			order,
			status
		});

		await newBanner.save();

		// Return
		return res.json({
			status: true,
			message: 'Thêm mới bìa quảng cáo thành công!',
			banner: newBanner
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			status: false,
			message: 'Lỗi máy chủ! Thêm mới bìa quảng cáo không thành công!'
		});
	}
});

// @route PUT /api/banners/:id
// @desc Update banner
// @access Private
router.put('/:id', async (req, res) => {
	try {
		// Check banner exists
		const { id } = req.params;

		const bannerValid = await Banner.findById(id);

		if (!bannerValid)
			return res.status(400).json({
				status: false,
				message: 'Không tìm thấy bìa quảng cáo!'
			});

		// Get new data
		const { title, image, url, order, status } = req.body;

		// All good
		const updatedBanner = await Banner.findByIdAndUpdate(
			id,
			{
				title,
				image,
				url,
				order,
				status
			},
			{ new: true }
		);

		// Return
		return res.json({
			status: true,
			message: 'Cập nhật thông tin bìa quảng cáo thành công!',
			banner: updatedBanner
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			status: false,
			message:
				'Lỗi máy chủ! Cập nhật thông tin bìa quảng cáo không thành công!'
		});
	}
});

// @route DELETE /api/banners/:id
// @desc Delete banner
// @access Private
router.delete('/:id', async (req, res) => {
	try {
		// Check for banner exists
		const { id } = req.params;
		const bannerValid = await Banner.findById(id);

		if (!bannerValid)
			return res.status(400).json({
				status: false,
				message: 'Không tìm thấy bìa quảng cáo!'
			});

		// All good
		const deletedBanner = await Banner.findByIdAndDelete(id);

		return res.json({
			status: true,
			message: `Xóa bìa quảng cáo thành công!`,
			banner: deletedBanner
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			status: false,
			message: 'Lỗi máy chủ! Xóa bìa quảng cáo không thành công!'
		});
	}
});

module.exports = router;
