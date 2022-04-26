import { CircleButton } from 'components/Buttons/CircleButton';
import { Alert, ListGroup } from 'react-bootstrap';

export const PhoneRomList = props => {
	const { roms, handleShowRomModal, handleRemoveRom } = props;

	return (
		<ListGroup>
			<ListGroup.Item className="fw-bold d-flex justify-content-between">
				<span className="mt-1">Rom</span>
				<CircleButton
					size="sm"
					icon="fas fa-plus"
					title="Thêm mới rom"
					className="ms-2 mt-1"
					onClick={handleShowRomModal}
				/>
			</ListGroup.Item>
			{roms.length > 0 ? (
				roms.map(rom => (
					<ListGroup.Item
						key={rom}
						className="d-flex justify-content-between"
					>
						<span>{rom}</span>
						<CircleButton
							size="sm"
							variant="danger"
							icon="fa fa-trash"
							title="Xóa rom"
							onClick={() => handleRemoveRom(rom)}
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
