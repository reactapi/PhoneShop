import { CircleButton } from 'components/Buttons';
import { FormCheck, Table } from 'react-bootstrap';

export const BannerList = props => {
	const {
		selectedItems,
		banners,
		onSelectItem,
		onShowModal,
		onUpdateBannerStatus,
		onRemoveBanner
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
					<th style={{ minWidth: 150 }}>Tiêu Đề</th>
					<th style={{ minWidth: 150 }}>Hình Ảnh</th>
					<th>Đường Dẫn</th>
					<th>Thứ tự</th>
					<th style={{ minWidth: 100 }}>Trạng Thái</th>
					<th style={{ minWidth: 100 }}>Công Cụ</th>
				</tr>
			</thead>
			<tbody>
				{banners.map(banner => {
					const active =
						selectedItems.findIndex(x => x === banner._id) >= 0;

					return (
						<tr key={banner._id}>
							<td align="center">
								<FormCheck
									checked={active}
									onChange={e =>
										onSelectItem({
											_id: banner._id,
											checked: e.target.checked
										})
									}
								/>
							</td>
							<td>{banner.title}</td>
							<td align="center">
								<img
									src={banner.image}
									width={100}
									height={50}
									alt={banner.title}
									className="border rounded"
								/>
							</td>
							<td>{banner.url}</td>
							<td align="center">{banner.order}</td>
							<td align="center">
								<FormCheck
									type="switch"
									id={`status-${banner._id}`}
									checked={banner.status}
									onChange={() =>
										onUpdateBannerStatus(banner)
									}
								/>
							</td>
							<td align="center">
								<CircleButton
									size="sm"
									type="button"
									icon="fas fa-fw fa-edit"
									title="Cập nhật thông tin"
									className="me-1"
									onClick={() => onShowModal(banner)}
								/>
								<CircleButton
									size="sm"
									type="button"
									variant="danger"
									icon="fas fa-fw fa-trash"
									title="Xóa"
									onClick={() => onRemoveBanner(banner)}
								/>
							</td>
						</tr>
					);
				})}
			</tbody>
		</Table>
	);
};
