import { CircleButton } from 'components/Buttons';
import { Badge, FormCheck, Table } from 'react-bootstrap';

export const PhoneList = props => {
	const {
		selectedItems,
		phones,

		onSelectItem,
		onShowModal,
		onUpdatePhoneStatus,
		onRemovePhone
	} = props;

	return (
		<Table responsive bordered style={{ minWidth: 800 }}>
			<thead>
				<tr align="center">
					<th>
						<FormCheck onChange={e => onSelectItem({ all: e.target.checked })} />
					</th>
					<th>Ảnh</th>
					<th style={{ minWidth: 200 }}>Tên</th>
					<th>Danh Mục</th>
					<th>Trạng Thái</th>
					<th>Công Cụ</th>
				</tr>
			</thead>
			<tbody>
				{phones.map(phone => {
					const active = selectedItems.findIndex(x => x === phone._id) >= 0;

					return (
						<tr key={phone._id}>
							<td align="center">
								<FormCheck
									checked={active}
									onChange={e =>
										onSelectItem({
											_id: phone._id,
											checked: e.target.checked
										})
									}
								/>
							</td>
							<td align="center">
								<img
									src={phone.photos[0].url}
									alt={phone.photos[0].title}
									className="rounded"
									style={{
										width: 80,
										maxHeight: 66
									}}
								/>
							</td>
							<td>{phone.name}</td>
							<td align="center">
								<Badge bg="primary">{phone.category.name}</Badge>
							</td>
							<td align="center">
								<FormCheck
									type="switch"
									id={`status-${phone._id}`}
									checked={phone.status}
									onChange={() => onUpdatePhoneStatus(phone)}
								/>
							</td>
							<td align="center">
								<CircleButton
									size="sm"
									type="button"
									icon="fas fa-fw fa-edit"
									title="Cập nhật thông tin"
									className="m-1"
									onClick={() => onShowModal(phone)}
								/>
								<CircleButton
									size="sm"
									type="button"
									variant="danger"
									icon="fas fa-fw fa-trash"
									title="Xóa"
									className="m-1"
									onClick={() => onRemovePhone(phone)}
								/>
							</td>
						</tr>
					);
				})}
			</tbody>
		</Table>
	);
};
