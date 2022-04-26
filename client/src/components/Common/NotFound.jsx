import { Link } from 'react-router-dom';

export const NotFound = ({ isAdmin }) => {
	return (
		<div className="text-center p-5">
			<div className="error mx-auto" data-text="404">
				404
			</div>
			<p className="lead text-gray-800 mb-5">Không tìm thấy trang!</p>
			<Link to={isAdmin ? '/admin' : '/'}>← Về trang {isAdmin ? 'Dashboard' : 'chủ'}</Link>
		</div>
	);
};
