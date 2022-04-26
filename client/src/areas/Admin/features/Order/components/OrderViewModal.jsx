import { Badge, Modal, Table } from 'react-bootstrap';
import { formatToVND } from 'utils';
import { OrderDetailList } from './';

export const OrderViewModal = props => {
	const { show, order, onClose } = props;
	return (
		<Modal size="xl" show={show} onHide={onClose}>
			<Modal.Header closeButton>
				<Modal.Title className="fw-bold" as="h5">
					Chi Tiết Đơn Hàng
				</Modal.Title>
			</Modal.Header>

			<Modal.Body>
				<Table bordered={false} borderless={true}>
					<tbody>
						<tr>
							<td style={{ width: '50%' }} className="text-end fw-bold">
								Mã đơn hàng
							</td>
							<td className="text-uppercase">{order._id}</td>
						</tr>
						<tr>
							<td className="text-end fw-bold">Khách hàng</td>
							<td>{order.user?.name}</td>
						</tr>
						<tr>
							<td className="text-end fw-bold">Địa chỉ giao hàng</td>
							<td>{order.address}</td>
						</tr>
						<tr>
							<td className="text-end fw-bold">Số điện thoại</td>
							<td>{order.phone}</td>
						</tr>
					</tbody>
				</Table>

				<OrderDetailList details={order.details} />

				<Table bordered={false} borderless={true}>
					<tbody>
						<tr>
							<td style={{ width: '50%' }} className="text-end fw-bold">
								Tổng tiền hàng
							</td>
							<td>{formatToVND(order.totalPrice)}</td>
						</tr>
						<tr>
							<td className="text-end fw-bold">Phí vận chuyển</td>
							<td>{formatToVND(order.shipPrice)}</td>
						</tr>
						<tr>
							<td className="text-end fw-bold">Giảm giá</td>
							<td>{formatToVND(order.discountPrice)}</td>
						</tr>
						<tr>
							<td className="text-end fw-bold">Thành tiền</td>
							<td>{formatToVND(order.finalPrice)}</td>
						</tr>
						<tr>
							<td className="text-end fw-bold">Trạng thái</td>
							<td>
								{order.status ? (
									<Badge bg="primary">Đã thanh toán</Badge>
								) : (
									<Badge bg="danger">Chưa thanh toán</Badge>
								)}
							</td>
						</tr>
					</tbody>
				</Table>
			</Modal.Body>
		</Modal>
	);
};
