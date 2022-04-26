import { SplitButton } from 'components/Buttons';
import { CircleButton } from 'components/Buttons/CircleButton';
import { Alert, Card, ListGroup } from 'react-bootstrap';

export const PhonePhotoList = props => {
	const { photos, colors, handleShowPhotoModal, handleRemovePhoto } = props;

	return (
		<ListGroup className="mb-3">
			<ListGroup.Item>
				<span className="fw-bold" id="photo">
					Hình ảnh
				</span>
			</ListGroup.Item>

			<ListGroup.Item className="p-2">
				{colors.length > 0 ? (
					colors.map(color => (
						<ListGroup className="mb-3" key={color}>
							<ListGroup.Item className="d-flex justify-content-between">
								<span className="fw-bold">{color}</span>
								<CircleButton
									size="sm"
									icon="fas fa-fw fa-plus"
									title="Thêm mới hình ảnh"
									onClick={() =>
										handleShowPhotoModal({
											title: color,
											url: ''
										})
									}
								/>
							</ListGroup.Item>

							{photos.filter(photo => photo.title === color)
								.length > 0 ? (
								<ListGroup.Item style={{ overflowX: 'scroll' }}>
									{photos
										.filter(photo => photo.title === color)
										.map((photo, index) => (
											<div
												key={index}
												className="p-2"
												style={{
													display: 'table-cell'
												}}
											>
												<Card>
													<Card.Body>
														<img
															src={photo.url}
															alt={photo.title}
															className="rounded"
															style={{
																width: 240,
																height: 'auto',
																maxHeight: 160
															}}
														/>
													</Card.Body>
													<Card.Footer className="bg-white d-flex justify-content-center">
														<SplitButton
															variant="primary"
															size="sm"
															icon="fas fa-fw fa-edit"
															text="Cập nhật"
															className="me-2"
															onClick={() =>
																handleShowPhotoModal(
																	{
																		title: color,
																		url: photo.url
																	}
																)
															}
														/>
														<SplitButton
															variant="danger"
															size="sm"
															icon="fas fa-fw fa-trash"
															text="Xóa"
															onClick={() =>
																handleRemovePhoto(
																	photo
																)
															}
														/>
													</Card.Footer>
												</Card>
											</div>
										))}
								</ListGroup.Item>
							) : (
								<ListGroup.Item className="p-2">
									<Alert variant="danger" className="mb-0">
										Không có dữ liệu!
									</Alert>
								</ListGroup.Item>
							)}
						</ListGroup>
					))
				) : (
					<Alert variant="danger" className="mb-0">
						Không có dữ liệu!
					</Alert>
				)}
			</ListGroup.Item>
		</ListGroup>
	);
};
