import { CircleButton } from 'components/Buttons';
import { Alert, ListGroup, Table } from 'react-bootstrap';
import { formatToNumberString, formatToVND } from 'utils';

export const PhoneModelList = props => {
	const { models, handleShowModelModal, handleRemoveModel } = props;

	return (
		<ListGroup className="mb-3">
			<ListGroup.Item className="d-flex justify-content-between">
				<span className="fw-bold mt-1">Phiên bản</span>
				<CircleButton
					size="sm"
					icon="fas fa-fw fa-plus"
					title="Thêm mới phiên bản"
					onClick={() => handleShowModelModal(null)}
				/>
			</ListGroup.Item>

			<ListGroup.Item className="p-2">
				{models.length > 0 ? (
					<Table bordered hover className="m-0">
						<thead>
							<tr align="center">
								<th>Rom</th>
								<th>Ram</th>
								<th>Màu</th>
								<th>Số lượng</th>
								<th>Giá</th>
								<th>Công cụ</th>
							</tr>
						</thead>

						<tbody>
							{models.map((model, index) => (
								<tr
									key={`${model.rom}-${model.ram}-${model.color}`}
								>
									<td>{model.rom}</td>
									<td>{model.ram}</td>
									<td>{model.color}</td>
									<td align="center">
										{formatToNumberString(model.quantity)}
									</td>
									<td>{formatToVND(model.price)}</td>
									<td align="center">
										<CircleButton
											size="sm"
											icon="fas fa-fw fa-edit"
											title="Cập nhật thông tin"
											className="m-1"
											onClick={() =>
												handleShowModelModal(model)
											}
										/>
										<CircleButton
											size="sm"
											variant="danger"
											icon="fas fa-fw fa-trash"
											title="Xóa"
											className="m-1"
											onClick={() =>
												handleRemoveModel(model)
											}
										/>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
				) : (
					<Alert variant="danger" className="m-0">
						Không có dữ liệu!
					</Alert>
				)}
			</ListGroup.Item>
		</ListGroup>
	);
};
