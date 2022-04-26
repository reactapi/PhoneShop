import React from 'react';
import { Alert, Card, Table } from 'react-bootstrap';

export const TopPhone = props => {
	const { topPhones } = props;

	return (
		<Card className="shadow border-0">
			<Card.Header className="fw-bold bg-white border-bottom-0">
				<i className="fas fa-mobile-button me-2 "></i>Top điện thoại
			</Card.Header>
			<Card.Body className="py-0">
				{topPhones.length ? (
					<Table bordered={false} borderless="true">
						<thead>
							<tr>
								<th>Điện thoại</th>
								<th className="text-center">Được mua</th>
							</tr>
						</thead>
						<tbody>
							{topPhones.map((item, index) => (
								<tr key={index}>
									<td>
										<span className="me-3">
											{index + 1}
										</span>
										<img
											src={item.phone.photo}
											width={50}
											height={30}
											className="rounded me-2"
											alt={item.phone.name}
										/>
										{item.phone.name}
									</td>
									<td align="center">{item.quantity}</td>
								</tr>
							))}
						</tbody>
					</Table>
				) : (
					<Alert variant="danger">Không có dữ liệu!</Alert>
				)}
			</Card.Body>
		</Card>
	);
};
