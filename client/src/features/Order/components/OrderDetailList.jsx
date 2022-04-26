import { Card, Col, Row } from 'react-bootstrap';
import { formatToNumberString, formatToVND } from 'utils';

export const OrderDetailList = props => {
	const { details } = props;

	return details.map(detail => (
		<Card key={detail._id} className="mt-2 shadow-sm">
			<Card.Body>
				<Row className="g-2">
					<Col xs="auto" className="d-flex justify-content-center">
						<img
							src={
								detail.phone?.photos.filter(
									photo => photo.title === detail.color
								)[0].url
							}
							alt={detail.phone?.name}
							width={140}
							height={100}
						/>
					</Col>
					<Col>
						<h5 className="fw-bold" style={{ fontSize: 14 }}>
							{detail.phone.name}
						</h5>
						<div className="d-flex justify-content-between mt-3">
							<div className="me-4">
								<div style={{ fontSize: 11 }}>Rom</div>
								<div
									className="fw-bold"
									style={{ fontSize: 13 }}
								>
									{detail.rom}
								</div>
							</div>

							<div className="me-4">
								<div style={{ fontSize: 11 }}>Ram</div>
								<div
									className="fw-bold"
									style={{ fontSize: 13 }}
								>
									{detail.ram}
								</div>
							</div>

							<div className="me-4">
								<div style={{ fontSize: 11 }}>Màu</div>
								<div
									className="fw-bold"
									style={{ fontSize: 13 }}
								>
									{detail.color}
								</div>
							</div>

							<div className="me-4">
								<div style={{ fontSize: 11 }}>Số lượng</div>
								<div
									className="fw-bold"
									style={{ fontSize: 13 }}
								>
									{formatToNumberString(detail.quantity)}
								</div>
							</div>
						</div>

						<div className="mt-2">
							<span>
								<span style={{ fontSize: 11 }}>Thành tiền</span>
								<span className="fw-bold text-danger ms-2">
									{formatToVND(
										detail.quantity * detail.price
									)}
								</span>
							</span>
						</div>
					</Col>
				</Row>
			</Card.Body>
		</Card>
	));
};
