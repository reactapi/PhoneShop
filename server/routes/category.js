const express = require('express');
const Category = require('../models/Category');
const { convertToMetaTilte } = require('../utils');
const router = express.Router();

// @route GET /api/categories
// @desc Get categories
// @access Public
router.get('/', async (req, res) => {
	try {
		const { key, parent, status } = req.query;

		// Query
		let query = {};

		if (key) query = { name: new RegExp(key, 'i') };
		if (parent) query = { ...query, parent };
		if (status !== undefined) query = { ...query, status };

		// Pagination
		let { _page, _limit } = req.query;

		_page = !_page && _limit ? 1 : parseInt(_page);
		_limit = _page && !_limit ? 5 : parseInt(_limit);

		const _skip = _page ? (_page - 1) * _limit : undefined;
		const _totalRows = await Category.count(query);
		const pagination = _page ? { _page, _limit, _totalRows } : undefined;

		const categories = await Category.find(query).populate('parent').skip(_skip).limit(_limit);

		// Return
		return res.json({
			status: true,
			data: categories,
			pagination
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			status: false,
			message: 'Lỗi máy chủ! Lấy danh sách danh mục không thành công!'
		});
	}
});

// @route GET /api/categories
// @desc Get category
// @access Public
router.get('/:metaTitle', async (req, res) => {
	try {
		const { metaTitle } = req.params;

		const category = await Category.findOne({ metaTitle });

		if (!category)
			return res.status(400).json({
				status: false,
				message: 'Không tìm thấy danh mục!'
			});

		// All good
		return res.json({
			status: true,
			category
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			status: false,
			message: 'Lỗi máy chủ! Lấy thông tin danh mục không thành công!'
		});
	}
});

// @route POST /api/categories
// @desc Add category
// @access Private
router.post('/', async (req, res) => {
	try {
		const { name, parent, status } = req.body;
		const metaTitle = convertToMetaTilte(name);

		// Check metaTitle
		const metaTitleValid = !(await Category.findOne({ metaTitle }));

		if (!metaTitleValid)
			return res.status(400).json({
				status: false,
				message: 'Tên danh mục hoặc Meta Title đã tồn tại!'
			});

		// Check for parent exists
		if (parent) {
			const parentValid = await Category.findById(parent);

			if (!parentValid)
				return res.status(400).json({
					status: false,
					message: 'Không tìm thấy danh mục cấp trên!'
				});
		}

		// All good
		const newCategory = new Category({
			name,
			metaTitle,
			parent,
			status
		});

		await newCategory.save();

		// Return
		return res.json({
			status: true,
			message: 'Thêm mới danh mục thành công!',
			category: newCategory
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			status: false,
			message: 'Lỗi máy chủ! Thêm mới danh mục không thành công!'
		});
	}
});

// @route PUT /api/categories
// @desc Update category
// @access Private
router.put('/:id', async (req, res) => {
	try {
		// Check category exists
		const { id } = req.params;

		const categoryValid = await Category.findById(id);

		if (!categoryValid)
			return res.status(400).json({
				status: false,
				message: 'Không tìm thấy danh mục!'
			});

		// Get new data
		const { name, parent, status } = req.body;
		const metaTitle = name ? convertToMetaTilte(name) : undefined;

		// Check metaTitle
		if (name) {
			const metaTitleValid = !(await Category.findOne({
				_id: { $ne: id },
				metaTitle
			}));

			if (!metaTitleValid)
				return res.status(400).json({
					status: false,
					message: 'Tên danh mục hoặc Meta Title đã tồn tại!'
				});
		}

		// Check for parent exists
		if (parent) {
			const parentValid = await Category.findOne({
				$and: [{ _id: { $ne: id } }, { _id: parent }]
			});

			if (!parentValid)
				return res.status(400).json({
					status: false,
					message: 'Không tìm thấy danh mục cấp trên!'
				});
		}

		// All good
		const updatedCategory = await Category.findByIdAndUpdate(
			id,
			{
				name,
				metaTitle,
				parent,
				status
			},
			{ new: true }
		).populate('parent');

		// Return
		return res.json({
			status: true,
			message: 'Cập nhật thông tin danh mục thành công!',
			category: updatedCategory
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			status: false,
			message: 'Lỗi máy chủ! Cập nhật thông tin danh mục không thành công!'
		});
	}
});

// @route DELETE /api/categories
// @desc Delete category
// @access Private
router.delete('/:id', async (req, res) => {
	try {
		// Check for category exists
		const { id } = req.params;
		const categoryValid = await Category.findById(id);

		if (!categoryValid)
			return res.status(400).json({
				status: false,
				message: 'Không tìm thấy danh mục!'
			});

		// All good
		const deletedCategory = await Category.findByIdAndDelete(id);

		return res.json({
			status: true,
			message: `Xóa danh mục ${deletedCategory.name} thành công!`,
			category: deletedCategory
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			status: false,
			message: 'Lỗi máy chủ! Xóa danh mục không thành công!'
		});
	}
});

module.exports = router;
