import { CircleButton } from 'components/Buttons';
import { Badge, FormCheck, Table } from 'react-bootstrap';

export const CategoryList = props => {
	const {
		selectedItems,
		categories,
		onSelectItem,
		onShowModal,
		onUpdateCategoryStatus,
		onRemoveCategory
	} = props;

	return (
		<Table bordered responsive style={{ minWidth: 700 }}>
			<thead>
				<tr align="center">
					<th>
						<FormCheck onChange={e => onSelectItem({ all: e.target.checked })} />
					</th>
					<th style={{ minWidth: 150 }}>Tên</th>
					<th>Danh Mục Cấp Trên</th>
					<th>Trạng Thái</th>
					<th>Công Cụ</th>
				</tr>
			</thead>
			<tbody>
				{categories.map(category => {
					const active = selectedItems.findIndex(x => x === category._id) >= 0;

					return (
						<tr key={category._id}>
							<td align="center">
								<FormCheck
									checked={active}
									onChange={e =>
										onSelectItem({
											_id: category._id,
											checked: e.target.checked
										})
									}
								/>
							</td>
							<td>{category.name}</td>
							<td align="center">
								<Badge bg={category.parent ? 'primary' : 'danger'}>
									{category.parent?.name || 'Không có'}
								</Badge>
							</td>
							<td align="center">
								<FormCheck
									type="switch"
									id={`status-${category._id}`}
									checked={category.status}
									onChange={() => onUpdateCategoryStatus(category)}
								/>
							</td>
							<td align="center">
								<CircleButton
									size="sm"
									type="button"
									icon="fas fa-fw fa-edit"
									title="Cập nhật thông tin"
									className="me-1"
									onClick={() => onShowModal(category)}
								/>
								<CircleButton
									size="sm"
									type="button"
									variant="danger"
									icon="fas fa-fw fa-trash"
									title="Xóa"
									onClick={() => onRemoveCategory(category)}
								/>
							</td>
						</tr>
					);
				})}
			</tbody>
		</Table>
	);
};
