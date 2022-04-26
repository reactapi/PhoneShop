import { SplitButton } from 'components/Buttons';
import { Modal } from 'react-bootstrap';

export const Confirm = props => {
	const { show, title, message, onClose, onCancel, onSuccess } = props;

	const handleCancel = () => {
		onCancel?.();
		onClose();
	};

	const handleSucess = () => {
		onSuccess?.();
		onClose();
	};

	return (
		<Modal show={show} onHide={onClose} backdrop="static">
			{title && (
				<Modal.Header closeButton>
					<Modal.Title className="fw-bold" as="h5">
						{title}
					</Modal.Title>
				</Modal.Header>
			)}
			<Modal.Body>{message}</Modal.Body>
			<Modal.Footer>
				<SplitButton
					size="sm"
					variant="secondary"
					icon="fas fa-fw fa-times"
					text="Hủy"
					onClick={handleCancel}
				/>
				<SplitButton
					size="sm"
					variant="primary"
					icon="fas fa-fw fa-check"
					text="Đồng ý"
					onClick={handleSucess}
				/>
			</Modal.Footer>
		</Modal>
	);
};
