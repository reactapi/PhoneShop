import { CircleButton } from 'components/Buttons';
import { FormCheck, Table } from 'react-bootstrap';
import { formatToNumberString, formatToVND } from 'utils';

export const DiscountList = props => {
	const {
		selectedItems,
		discounts,
		onSelectItem,
		onShowModal,
		onUpdateDiscountStatus,
		onRemoveDiscount
	} = props;

	return (
		<Table bordered responsive style={{ minWidth: 700 }}>
			<thead>
				<tr align="center">
					<th>
						<FormCheck onChange={e => onSelectItem({ all: e.target.checked })} />
					</th>
					<th>Mã</th>
					<th style={{ minWidth: 150 }}>Tên</th>
					<th>Số lượng</th>
					<th>Giảm</th>
					<th>Trạng Thái</th>
					<th>Công Cụ</th>
				</tr>
			</thead>
			<tbody>
				{discounts.map(discount => {
					const active = selectedItems.findIndex(x => x === discount._id) >= 0;

					return (
						<tr key={discount._id}>
							<td align="center">
								<FormCheck
									checked={active}
									onChange={e =>
										onSelectItem({
											_id: discount._id,
											checked: e.target.checked
										})
									}
								/>
							</td>
							<td>{discount.code}</td>
							<td>{discount.name}</td>
							<td align="center">{formatToNumberString(discount.quantity)}</td>
							<td>{formatToVND(discount.price)}</td>
							<td align="center">
								<FormCheck
									type="switch"
									id={`status-${discount._id}`}
									checked={discount.status}
									onChange={() => onUpdateDiscountStatus(discount)}
								/>
							</td>
							<td align="center">
								<CircleButton
									size="sm"
									type="button"
									icon="fas fa-fw fa-edit"
									title="Cập nhật thông tin"
									className="me-1"
									onClick={() => onShowModal(discount)}
								/>
								<CircleButton
									size="sm"
									type="button"
									variant="danger"
									icon="fas fa-fw fa-trash"
									title="Xóa"
									onClick={() => onRemoveDiscount(discount)}
								/>
							</td>
						</tr>
					);
				})}
			</tbody>
		</Table>
	);
};
