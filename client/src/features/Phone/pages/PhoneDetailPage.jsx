import categoryApi from 'api/categoryApi';
import phoneApi from 'api/phoneApi';
import { cartActions } from 'app/cartSlice';
import { SplitButton } from 'components/Buttons/SplitButton';
import { useEffect, useState } from 'react';
import { Alert, Breadcrumb, Button, Carousel, Col, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { formatToNumberString, formatToVND } from 'utils';

const PhoneDetailPage = () => {
	const history = useHistory();

	// Fetch phone
	const [loading, setLoading] = useState(false);
	const [phone, setPhone] = useState({});
	const { categoryMetaTitle, phoneMetaTitle } = useParams();

	useEffect(() => {
		const fetchPhone = async () => {
			setLoading(true);
			const res = await phoneApi.fetch(phoneMetaTitle);

			if (res.status) {
				const phone = res.data.status ? res.data : {};

				setPhone(phone);
				setLoading(false);
			} else {
				history.push('/404');
			}
		};

		fetchPhone();
	}, [history, phoneMetaTitle]);

	// Fetch category
	const [category, setCategory] = useState({});
	useEffect(() => {
		const fetchCategory = async () => {
			if (categoryMetaTitle) {
				const res = await categoryApi.fetch(categoryMetaTitle);

				if (res.status) {
					setCategory(res.category);
				} else {
					history.push('/404');
				}
			}
		};

		fetchCategory();
	}, [history, categoryMetaTitle]);

	// Selected model
	const [selectedModel, setSelectedModel] = useState({});

	useEffect(() => {
		setSelectedModel({
			rom: phone.models?.[0].rom,
			ram: phone.models?.[0].ram,
			color: phone.models?.[0].color
		});

		setPhotos(
			phone.photos?.filter(
				photo => photo.title === phone.models?.[0].color
			)
		);
	}, [phone.models, phone.photos]);

	// Rom
	const handleSelectRom = rom => {
		const models = phone.models?.filter(x => x.rom === rom);

		setSelectedModel({
			rom,
			ram: models[0]?.ram || null,
			color: models[0]?.color || null
		});
	};

	// Rams
	const [rams, setRams] = useState([]);
	useEffect(() => {
		let newRams = [];

		for (let model of phone.models || []) {
			if (
				model.rom === selectedModel.rom &&
				newRams.findIndex(x => x === model.ram) < 0
			) {
				newRams.push(model.ram);
			}
		}

		setRams(newRams);
	}, [phone.models, selectedModel.rom]);

	const handleSelectRam = ram => {
		const models =
			phone.models?.filter(
				x => x.rom === selectedModel.rom && x.ram === selectedModel.ram
			) || [];

		setSelectedModel({
			...selectedModel,
			ram,
			color: models[0].color
		});
	};

	// Color
	const [colors, setColors] = useState([]);

	useEffect(() => {
		let newColors = [];

		for (let model of phone.models || []) {
			if (
				model.rom === selectedModel.rom &&
				model.ram === selectedModel.ram &&
				newColors.findIndex(x => x === model.color) < 0
			) {
				newColors.push(model.color);
			}
		}

		setColors(newColors);
	}, [phone.models, selectedModel.rom, selectedModel.ram]);

	const handleSelectColor = color => {
		setSelectedModel({ ...selectedModel, color });
	};

	// Quantity and Price
	const [quantity, setQuantity] = useState(0);
	const [price, setPrice] = useState(0);

	useEffect(() => {
		const models = phone.models?.filter(
			model =>
				model.rom === selectedModel.rom &&
				model.ram === selectedModel.ram &&
				model.color === selectedModel.color
		)?.[0];

		setQuantity(models?.quantity || 0);
		setPrice(models?.price || 0);
	}, [phone.models, selectedModel]);

	// Photos
	const [photos, setPhotos] = useState([]);
	const [photoActiveIndex, setPhotoActiveIndex] = useState(0);

	useEffect(() => {
		const newPhotos = phone.photos?.filter(
			photo => photo.title === selectedModel.color
		);

		setPhotos(newPhotos || []);
	}, [phone.photos, selectedModel.color]);

	useEffect(() => {
		setPhotoActiveIndex(0);
	}, [photos]);

	// Cart
	const dispatch = useDispatch();

	const handleAddCartItem = async () => {
		if (quantity <= 0) {
			toast.error('Không đủ số lượng!');
			return;
		}

		dispatch(
			cartActions.add({
				phone,
				model: selectedModel,
				quantity: 1,
				price: price - (phone.promotionPrice || 0)
			})
		);
	};

	// Return
	return (
		<div className="px-5 py-4">
			{!loading && (
				<div>
					<Breadcrumb className="bg-white p-3 pb-1 rounded shadow mb-3">
						<Breadcrumb.Item href="/">Trang chủ</Breadcrumb.Item>
						<Breadcrumb.Item href="/dien-thoai">
							Điện thoại
						</Breadcrumb.Item>
						<Breadcrumb.Item
							href={`/dien-thoai/${categoryMetaTitle}`}
						>
							{category.name}
						</Breadcrumb.Item>
						<Breadcrumb.Item active>{phone.name}</Breadcrumb.Item>
					</Breadcrumb>

					<div className="bg-white rounded shadow p-4">
						<Row>
							<Col xl={6}>
								<Carousel
									variant="dark"
									indicators={false}
									interval={null}
									activeIndex={photoActiveIndex}
									onSelect={(selectedIndex, e) => {
										setPhotoActiveIndex(selectedIndex);
									}}
									prevIcon={
										<span className="bg-white pt-1 rounded-end">
											<span
												aria-hidden="true"
												className="carousel-control-prev-icon"
											/>
										</span>
									}
									nextIcon={
										<span className="bg-white pt-1 rounded-start">
											<span
												aria-hidden="true"
												className="carousel-control-next-icon"
											/>
										</span>
									}
								>
									{photos?.map(photo => (
										<Carousel.Item key={photo._id}>
											<img
												className="d-block w-100"
												src={photo.url}
												alt={photo.title}
												style={{ borderRadius: 4 }}
											/>
										</Carousel.Item>
									))}
								</Carousel>
								<div className="text-center pt-3">
									{photoActiveIndex + 1} / {photos.length}
								</div>
							</Col>
							<Col xl={6}>
								<h5 className="fw-bold">{phone.name}</h5>
								<div>
									{phone.roms?.map(rom => (
										<Button
											key={rom}
											variant={
												rom === selectedModel.rom
													? 'outline-primary'
													: 'outline-secondary'
											}
											className="mt-3 me-2"
											onClick={() => handleSelectRom(rom)}
										>
											{rom}
										</Button>
									))}
								</div>
								<div>
									{rams.map(ram => (
										<Button
											key={ram}
											variant={
												ram === selectedModel.ram
													? 'outline-primary'
													: 'outline-secondary'
											}
											className="mt-3 me-2"
											onClick={() => handleSelectRam(ram)}
										>
											{ram}
										</Button>
									))}
								</div>
								<div>
									{colors.map(color => (
										<Button
											key={color}
											variant={
												color === selectedModel.color
													? 'outline-primary'
													: 'outline-secondary'
											}
											className="mt-3 me-2"
											onClick={() =>
												handleSelectColor(color)
											}
										>
											{color}
										</Button>
									))}
								</div>
								<div className="my-3">
									{quantity === 0 ? (
										<Button as="div" variant="danger">
											Hết hàng
										</Button>
									) : (
										<>
											Còn{' '}
											<b>
												{formatToNumberString(quantity)}
											</b>{' '}
											chiếc
										</>
									)}
								</div>
								<Alert variant="primary">
									{phone.promotionPrice &&
									phone.promotionPrice > 0 ? (
										<div className="mb-2">
											<span className="text-decoration-line-through me-2 text-secondary">
												{formatToVND(price)}
											</span>
											<span className="text-danger">
												-
												{formatToVND(
													phone.promotionPrice
												)}
											</span>
										</div>
									) : null}
									<SplitButton
										icon="fas fa-fw fa-cart-arrow-down"
										disabled={quantity <= 0}
										text={
											<b>
												{price === 0
													? 'Miễn phí'
													: formatToVND(
															price -
																(phone.promotionPrice ||
																	0)
													  )}
											</b>
										}
										onClick={handleAddCartItem}
									/>
								</Alert>
							</Col>
						</Row>
					</div>

					<div className="bg-white rounded shadow mt-3">
						<div className="phdr">Bài viết đánh giá</div>
						<div className="p-3">
							{phone.description ? (
								<div
									dangerouslySetInnerHTML={{
										__html: phone.description
									}}
								></div>
							) : (
								<Alert variant="danger" className="mb-0">
									Không có!
								</Alert>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default PhoneDetailPage;
