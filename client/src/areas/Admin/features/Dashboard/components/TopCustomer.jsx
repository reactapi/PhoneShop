import React from 'react';
import { Alert, Card, Table } from 'react-bootstrap';
import { formatToVND } from 'utils';

export const TopCustomer = props => {
	const { topCustomers } = props;

	return (
		<Card className="shadow border-0">
			<Card.Header className="fw-bold bg-white border-bottom-0">
				<i className="fas fa-user me-2 "></i>Top khách hàng
			</Card.Header>
			<Card.Body className="py-0">
				{topCustomers.length ? (
					<Table bordered={false} borderless="true">
						<thead>
							<tr>
								<th>Khách hàng</th>
								<th className="text-end">Mua</th>
							</tr>
						</thead>
						<tbody>
							{topCustomers.map((item, index) => (
								<tr key={index}>
									<td>
										<span className="me-3">
											{index + 1}
										</span>
										<img
											src={item.user.avatar}
											width={30}
											height={30}
											className="border rounded-circle me-2"
											alt={item.user.name}
										/>
										{item.user.name}
									</td>
									<td align="right">
										{formatToVND(item.price)}
									</td>
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
