const express = require('express');
const router = express.Router();
const multiparty = require('connect-multiparty');
const FileMiddleware = multiparty({
	uploadDir: './public/uploads/files'
});
const ImageMiddleware = multiparty({
	uploadDir: './public/uploads/images'
});

const path = require('path');
const fs = require('fs');
const { formatToVNDate } = require('../utils');
const uploadPath = path.join(__dirname, '../public/uploads/');

router.get('/:type', (req, res) => {
	try {
		const { type } = req.params;
		const fileNames = fs.readdirSync(uploadPath + '/' + type + '/');
		let files = [];

		for (let fileName of fileNames) {
			let fileInfor = fs.statSync(
				uploadPath + '' + '/' + type + '/' + fileName
			);

			files.push({
				name: fileName,
				size: fileInfor.size,
				createdDate: fileInfor.birthtime
			});
		}

		files.sort((x, y) => new Date(y.createdDate) - new Date(x.createdDate));
		files = files.map(file => ({
			...file,
			createdDate: formatToVNDate(file.createdDate)
		}));

		return res.json({
			status: true,
			data: files
		});
	} catch (error) {
		console.log(error);

		return res.status(500).json({
			status: false,
			message: 'Lỗi máy chủ!'
		});
	}
});

// @route POST /api/uploads/images
// @desc add image
// @access public
router.post('/images', ImageMiddleware, (req, res) => {
	try {
		var TempFile = req.files.upload;
		var TempPathfile = TempFile.path;
		const targetPathUrl = uploadPath + 'images\\' + TempFile.name;
		const originalFilename = path
			.extname(TempFile.originalFilename)
			.toLowerCase();

		// Check type
		if (originalFilename !== '.png' || '.jpg') {
			fs.renameSync(TempPathfile, targetPathUrl);

			// File Infor
			const fileInfor = fs.statSync(
				uploadPath + '/images/' + TempFile.name
			);

			const file = {
				name: TempFile.name,
				size: fileInfor.size,
				createdDate: formatToVNDate(new Date(fileInfor.birthtime))
			};

			return res.json({
				uploaded: true,
				url: `http://localhost:5000/uploads/images/${TempFile.originalFilename}`,
				file
			});
		}

		// Type invalid
		return res.status(400).json({
			uploaded: false,
			message: 'Không đúng định dạng ảnh!'
		});
	} catch (error) {
		console.log(error);

		return res.status(500).json({
			uploaded: false,
			message: 'Lỗi máy chủ!'
		});
	}
});

// @route POST /api/uploads/files
// @desc add image
// @access public
router.post('/files', FileMiddleware, (req, res) => {
	try {
		var TempFile = req.files.upload;
		var TempPathfile = TempFile.path;
		const targetPathUrl = uploadPath + 'files\\' + TempFile.name;
		const originalFilename = path
			.extname(TempFile.originalFilename)
			.toLowerCase();

		fs.renameSync(TempPathfile, targetPathUrl);

		// File Infor
		const fileInfor = fs.statSync(uploadPath + '/files/' + TempFile.name);

		const file = {
			name: TempFile.name,
			size: fileInfor.size,
			createdDate: formatToVNDate(new Date(fileInfor.birthtime))
		};

		return res.json({
			uploaded: true,
			url: `http://localhost:5000/uploads/files/${TempFile.originalFilename}`,
			file
		});
	} catch (error) {
		console.log(error);

		return res.status(500).json({
			uploaded: false,
			message: 'Lỗi máy chủ!'
		});
	}
});

// @api /api/uploads/(images || files )/name
// @desc update file
// @access Private
router.put('/:type/:name', (req, res) => {
	try {
		const { type, name } = req.params;
		const newName = req.body.name;

		fs.renameSync(
			uploadPath + type + '\\' + name,
			uploadPath + type + '\\' + newName
		);

		return res.json({
			status: true,
			message:
				'Đổi tên ' +
				(type === 'images' ? 'ảnh' : 'tệp tin') +
				' thành công!'
		});
	} catch (error) {
		console.log(error);

		return res.status(500).json({
			status: false,
			message:
				'Đổi tên ' +
				(type === 'images' ? 'ảnh' : 'tệp tin') +
				' không thành công!'
		});
	}
});

router.delete('/:type/:name', (req, res) => {
	try {
		const { type, name } = req.params;

		// File Infor
		const fileInfor = fs.statSync(uploadPath + type + '\\' + name);

		const file = {
			name,
			size: fileInfor.size,
			createdDate: formatToVNDate(new Date(fileInfor.birthtime))
		};

		fs.unlinkSync(uploadPath + type + '\\' + name);

		return res.json({
			status: true,
			message:
				'Xóa ' +
				(type === 'images' ? 'ảnh' : 'tệp tin') +
				' thành công!',
			file
		});
	} catch (error) {
		console.log(error);

		return res.status(500).json({
			status: false,
			message:
				'Xóa ' +
				(type === 'images' ? 'ảnh' : 'tệp tin') +
				' không thành công!'
		});
	}
});

module.exports = router;
