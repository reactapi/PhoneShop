import { Badge, Modal, Table } from 'react-bootstrap';
import { formatToVND } from 'utils';
import { OrderDetailList } from './';

export const OrderViewModal = props => {
	const { show, order, onClose } = props;

	return (
		<Modal show={show} onHide={onClose}>
			<Modal.Header closeButton>
				<Modal.Title className="fw-bold text-uppercase" as="h5">
					<i className="fas fa-code me-2"></i>
					{order._id}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Table bordered={false} borderless={true}>
					<tbody>
						<tr>
							<td width={150}>Địa chỉ nhận hàng</td>
							<td className="text-end">{order.address}</td>
						</tr>
						<tr>
							<td>Số điện thoại</td>
							<td className="text-end">{order.phone}</td>
						</tr>
					</tbody>
				</Table>

				<OrderDetailList details={order.details} />

				<Table bordered={false} borderless={true} className="mt-3">
					<tbody>
						<tr>
							<td width={150}>Tổng tiền hàng</td>
							<td className="text-end">
								{formatToVND(order.totalPrice || 0)}
							</td>
						</tr>

						<tr>
							<td width={150}>Phí vận chuyển</td>
							<td className="text-end">
								{formatToVND(order.shipPrice || 0)}
							</td>
						</tr>

						<tr>
							<td width={150}>Giảm giá</td>
							<td className="text-end">
								{formatToVND(order.discountPrice || 0)}
							</td>
						</tr>

						<tr>
							<td width={150}>Thành tiền</td>
							<td className="text-end">
								{formatToVND(order.finalPrice || 0)}
							</td>
						</tr>

						<tr>
							<td width={150}>Trạng thái</td>
							<td className="text-end">
								{order.status ? (
									<Badge bg="primary">Đã giao</Badge>
								) : (
									<Badge bg="danger">Đang giao</Badge>
								)}
							</td>
						</tr>
					</tbody>
				</Table>
			</Modal.Body>
		</Modal>
	);
};
