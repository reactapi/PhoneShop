import { CircleButton } from 'components/Buttons/CircleButton';
import { Table } from 'react-bootstrap';
import Select from 'react-select';
import { formatToVNDate } from 'utils';

export const OrderList = props => {
	const { orders, handleShowViewModal, handleUpdateOrderStatus } = props;

	const statusOptions = [
		{ value: true, label: 'Đã thanh toán' },
		{ value: false, label: 'Chưa thanh toán' }
	];

	return (
		<Table responsive bordered style={{ minWidth: 800 }}>
			<thead align="center">
				<tr>
					<th style={{ minWidth: 200 }}>Họ tên</th>
					<th>Số điện thoại</th>
					<th>Ngày đặt</th>
					<th>Trạng thái</th>
					<th>Công cụ</th>
				</tr>
			</thead>
			<tbody>
				{orders.map(order => (
					<tr key={order._id}>
						<td>{order.user?.name}</td>
						<td align="center">{order.user?.phone}</td>
						<td align="center">{formatToVNDate(new Date(order.createdDate))}</td>
						<td align="center">
							<div style={{ maxWidth: 200 }}>
								<Select
									value={statusOptions.find(option => option.value === order.status)}
									options={statusOptions}
									className={`react-select${order.status ? ' is-valid' : ' is-invalid'}`}
									onChange={selectedOption =>
										handleUpdateOrderStatus({ _id: order._id, status: selectedOption.value })
									}
								/>
							</div>
						</td>
						<td align="center">
							<CircleButton
								icon="fas fa-fw fa-eye"
								title="Xem chi tiết"
								size="sm"
								className="m-1"
								onClick={() => handleShowViewModal(order)}
							/>
						</td>
					</tr>
				))}
			</tbody>
		</Table>
	);
};
