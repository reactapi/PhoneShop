import { CircleButton } from 'components/Buttons';
import { FormCheck, Table } from 'react-bootstrap';

export const UserList = props => {
	const {
		selectedItems,
		users,
		onSelectItem,
		onShowModal,
		onUpdateUserStatus,
		onRemoveUser
	} = props;

	return (
		<Table bordered responsive style={{ minWidth: 700 }}>
			<thead>
				<tr align="center">
					<th>
						<FormCheck
							onChange={e =>
								onSelectItem({ all: e.target.checked })
							}
						/>
					</th>
					<th style={{ minWidth: 150 }}>Tên</th>
					<th>Trạng Thái</th>
					<th>Công Cụ</th>
				</tr>
			</thead>
			<tbody>
				{users.map(user => {
					const active =
						selectedItems.findIndex(x => x === user._id) >= 0;

					return (
						<tr key={user._id}>
							<td align="center">
								<FormCheck
									checked={active}
									onChange={e =>
										onSelectItem({
											_id: user._id,
											checked: e.target.checked
										})
									}
								/>
							</td>
							<td>
								<img
									src={user.avatar}
									width={40}
									height={40}
									className="rounded-circle me-2"
									alt={`Ảnh đại diện - Người dùng ${user.name}`}
								/>
								{user.name}
							</td>
							<td align="center">
								<FormCheck
									type="switch"
									id={`status-${user._id}`}
									checked={user.status}
									onChange={() => onUpdateUserStatus(user)}
								/>
							</td>
							<td align="center">
								<CircleButton
									size="sm"
									type="button"
									icon="fas fa-fw fa-edit"
									title="Cập nhật thông tin"
									className="me-1"
									onClick={() => onShowModal(user)}
								/>
								<CircleButton
									size="sm"
									type="button"
									variant="danger"
									icon="fas fa-fw fa-trash"
									title="Xóa"
									onClick={() => onRemoveUser(user)}
								/>
							</td>
						</tr>
					);
				})}
			</tbody>
		</Table>
	);
};
