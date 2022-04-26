import { CircleButton } from 'components/Buttons/CircleButton';
import { Alert, ListGroup } from 'react-bootstrap';

export const PhoneRamList = props => {
	const { rams, handleShowRamModal, handleRemoveRam } = props;

	return (
		<ListGroup>
			<ListGroup.Item className="fw-bold d-flex justify-content-between">
				<span className="mt-1">Ram</span>
				<CircleButton
					size="sm"
					icon="fa fa-plus"
					title="Thêm mới ram"
					onClick={handleShowRamModal}
				/>
			</ListGroup.Item>
			{rams.length > 0 ? (
				rams.map(ram => (
					<ListGroup.Item
						key={ram}
						className="d-flex justify-content-between"
					>
						<span>{ram}</span>
						<CircleButton
							size="sm"
							variant="danger"
							icon="fa fa-trash"
							title="Xóa ram"
							onClick={() => handleRemoveRam(ram)}
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
