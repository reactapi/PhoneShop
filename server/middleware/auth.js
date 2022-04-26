const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
	try {
		const authHeader = req.header('Authorization');
		const token = authHeader.split(' ')[1];

		if (!token)
			return res.status(401).json({
				status: false,
				message: 'Không tìm thấy token!'
			});

		const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		req.userId = decoded.userId;
		next();
	} catch (error) {
		console.log(error);
		return res.status(501).json({
			status: false,
			message: 'Token không hợp lệ!'
		});
	}
};

module.exports = verifyToken;
