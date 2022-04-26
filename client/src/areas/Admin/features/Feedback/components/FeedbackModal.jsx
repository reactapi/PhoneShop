import React from 'react';
import { Modal, Table } from 'react-bootstrap';

const FeedbackModal = props => {
	const { show, viewedFeedback, onClose } = props;

	return (
		<Modal show={show} onHide={onClose}>
			<Modal.Header closeButton>
				<Modal.Title className="fw-bold" as="h5">
					Phản Hồi
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Table bordered={false} borderless={false}>
					<tr>
						<td className="text-end pe-2 fw-bold">Họ tên</td>
						<td>{viewedFeedback.name}</td>
					</tr>
					<tr>
						<td className="text-end pe-2 fw-bold">Số điện thoại</td>
						<td>{viewedFeedback.phone}</td>
					</tr>
					<tr>
						<td className="text-end pe-2 fw-bold">Email</td>
						<td>{viewedFeedback.email}</td>
					</tr>
					<tr>
						<td className="text-end pe-2 fw-bold">Nội dung</td>
						<td>{viewedFeedback.content}</td>
					</tr>
				</Table>
			</Modal.Body>
		</Modal>
	);
};

export default FeedbackModal;
