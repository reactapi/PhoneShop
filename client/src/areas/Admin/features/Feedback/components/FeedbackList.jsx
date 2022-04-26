import { CircleButton } from 'components/Buttons';
import { Badge, FormCheck, Table } from 'react-bootstrap';

export const FeedbackList = props => {
	const {
		selectedItems,
		feedbacks,
		onSelectItem,
		onShowModal,
		onRemoveFeedback
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
					<th style={{ minWidth: 150 }}>Họ Tên</th>
					<th>Số Điện Thoại</th>
					<th>Email</th>
					<th>Trạng Thái</th>
					<th>Công Cụ</th>
				</tr>
			</thead>
			<tbody>
				{feedbacks.map(feedback => {
					const active =
						selectedItems.findIndex(x => x === feedback._id) >= 0;

					return (
						<tr key={feedback._id}>
							<td align="center">
								<FormCheck
									checked={active}
									onChange={e =>
										onSelectItem({
											_id: feedback._id,
											checked: e.target.checked
										})
									}
								/>
							</td>
							<td>{feedback.name}</td>
							<td>{feedback.phone}</td>
							<td>{feedback.email}</td>
							<td align="center">
								<Badge
									bg={feedback.status ? 'primary' : 'danger'}
								>
									{feedback.status ? 'Đã xem' : 'Chưa xem'}
								</Badge>
							</td>
							<td align="center">
								<CircleButton
									size="sm"
									type="button"
									icon="fas fa-fw fa-eye"
									title="Xem chi tiết"
									className="me-1"
									onClick={() => onShowModal(feedback)}
								/>
								<CircleButton
									size="sm"
									type="button"
									variant="danger"
									icon="fas fa-fw fa-trash"
									title="Xóa"
									onClick={() => onRemoveFeedback(feedback)}
								/>
							</td>
						</tr>
					);
				})}
			</tbody>
		</Table>
	);
};
