import { Table } from 'react-bootstrap';
import { formatToNumberString, formatToVND } from 'utils';

export const OrderDetailList = props => {
	const { details } = props;

	return (
		<Table responsive="lg" bordered hover style={{ minWidth: 1050 }}>
			<thead align="center">
				<tr>
					<th width={250}>Tên điện thoại</th>
					<th width={100}>Hình ảnh</th>
					<th width={100}>Rom</th>
					<th width={100}>Ram</th>
					<th width={100}>Màu</th>
					<th width={100}>Số lượng</th>
					<th width={150}>Đơn giá</th>
					<th width={150}>Thành tiền</th>
				</tr>
			</thead>
			<tbody>
				{details.map(detail => (
					<tr key={detail._id}>
						<td>{detail.phone.name}</td>
						<td align="center">
							<img
								src={
									detail.phone.photos.filter(
										photo => photo.title === detail.color
									)[0].url
								}
								alt={`${detail.phone.name} - ${detail.phone.photos[0].title}`}
								style={{ width: 100 }}
							/>
						</td>
						<td>{detail.rom}</td>
						<td>{detail.ram}</td>
						<td>{detail.color}</td>
						<td align="center">{formatToNumberString(detail.quantity)}</td>
						<td>{formatToVND(detail.price)}</td>
						<td>{formatToVND(detail.quantity * detail.price)}</td>
					</tr>
				))}
			</tbody>
		</Table>
	);
};
