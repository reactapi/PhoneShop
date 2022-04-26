import { CircleButton } from 'components/Buttons/CircleButton';
import { Card, Col, Row } from 'react-bootstrap';
import { formatToVND, formatToVNDate } from 'utils';

export const OrderList = props => {
	const { orders, handleShowViewModal } = props;

	return (
		<Row className="g-4 pt-2">
			{orders.map(order => {
				return (
					<Col md={6} xl={4} key={order._id}>
						<Card className="p-3 shadow-sm">
							<div>
								<i className="fas fa-code me-2"></i>
								<span className="fw-bold text-uppercase">
									{order._id}
								</span>
							</div>

							<div className="d-flex justify-content-between mt-3">
								<div className="me-4">
									<div
										className="small"
										style={{ fontSize: 11 }}
									>
										Ngày đặt
									</div>
									<div
										className="fw-bold"
										style={{ fontSize: 13 }}
									>
										{formatToVNDate(
											new Date(order.createdDate)
										)}
									</div>
								</div>

								<div className="me-4">
									<div
										className="small"
										style={{ fontSize: 11 }}
									>
										Tổng tiền
									</div>
									<div
										className="fw-bold"
										style={{ fontSize: 13 }}
									>
										{formatToVND(order.finalPrice)}
									</div>
								</div>

								<CircleButton
									size="sm"
									icon="fas fa-eye"
									title="Xem chi tiết"
									onClick={() => handleShowViewModal(order)}
								/>
							</div>
						</Card>
					</Col>
				);
			})}
		</Row>
	);
};
