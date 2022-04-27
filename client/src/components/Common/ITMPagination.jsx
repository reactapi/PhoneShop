import { Pagination } from 'react-bootstrap';

export const ITMPagination = ({ size, pagination, onChange }) => {
	const { _page, _totalPages } = pagination;

	let items = [];
	for (let i = 1; i <= _totalPages; i++) {
		items.push(
			<Pagination.Item
				key={i}
				active={i === _page}
				onClick={() => onChange(i)}
			>
				{i}
			</Pagination.Item>
		);
	}
	return (
		_totalPages > 1 && (
			<div>
				<div>
					Trang {_page} / {_totalPages}
				</div>
				<Pagination
					size={size}
					className="d-flex justify-content-center mb-0"
				>
					<Pagination.Item
						disabled={_page === 1}
						onClick={() => onChange(1)}
					>
						Đầu
					</Pagination.Item>
					{items}
					<Pagination.Item
						disabled={_page === _totalPages}
						onClick={() => onChange(_totalPages)}
					>
						Cuối
					</Pagination.Item>
				</Pagination>
			</div>
		)
	);
};
