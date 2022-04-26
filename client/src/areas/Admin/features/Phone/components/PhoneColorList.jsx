import { CircleButton } from 'components/Buttons/CircleButton';
import { Alert, ListGroup } from 'react-bootstrap';

export const PhoneColorList = props => {
	const { colors, handleShowColorModal, handleRemoveColor } = props;

	return (
		<ListGroup>
			<ListGroup.Item className="fw-bold d-flex justify-content-between">
				<span className="mt-1">Màu</span>
				<CircleButton
					size="sm"
					icon="fa fa-plus"
					title="Thêm mới màu"
					onClick={handleShowColorModal}
				/>
			</ListGroup.Item>
			{colors.length > 0 ? (
				colors.map(color => (
					<ListGroup.Item
						key={color}
						className="d-flex justify-content-between"
					>
						<span>{color}</span>
						<CircleButton
							size="sm"
							variant="danger"
							icon="fa fa-trash"
							title="Xóa màu"
							onClick={() => handleRemoveColor(color)}
						/>
					</ListGroup.Item>
				))
			) : (
				<ListGroup.Item className="p-2">
					<Alert variant="danger" className="m-0">
						Không có!
					</Alert>
				</ListGroup.Item>
			)}
		</ListGroup>
	);
};
