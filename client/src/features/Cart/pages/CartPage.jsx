import discountApi from 'api/discountApi';
import orderApi from 'api/orderApi';
import { selectCurrentUser } from 'app/authSlice';
import { cartActions, selectCart } from 'app/cartSlice';
import { SplitButton } from 'components/Buttons/SplitButton';
import { Confirm } from 'components/Common/Confirm';
import { useEffect, useState } from 'react';
import {
	Alert,
	Button,
	Col,
	FormControl,
	FormGroup,
	FormLabel,
	InputGroup,
	Row,
	Card,
	Badge
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { formatToVND, formatToNumberString } from 'utils';
import { CartList } from '../components/CartList';
import addressApi from 'api/addressApi';
import Select from 'react-select';

const CartPage = () => {
	const cart = useSelector(selectCart);
	const currentUser = useSelector(selectCurrentUser);

	const history = useHistory();
	const dispatch = useDispatch();

	const handleUpdateCartItem = cartItem => {
		dispatch(cartActions.updateItem(cartItem));
	};

	const handleRemoveCartItem = cartItem => {
		setConfirm({
			show: true,
			message: (
				<>
					Xóa điện thoại{' '}
					<b>
						{cartItem.phone.name} - {cartItem.model.rom} |{' '}
						{cartItem.model.ram} | {cartItem.model.color}
					</b>{' '}
					khỏi giỏ hàng?
				</>
			),
			onSuccess: () => {
				dispatch(cartActions.removeItem(cartItem));
				toast.success(
					<>
						Xóa thành công điện thoại{' '}
						<b>
							{cartItem.phone.name} - {cartItem.model.rom} |{' '}
							{cartItem.model.ram} | {cartItem.model.color}
						</b>{' '}
						khỏi giỏ hàng
					</>
				);
			}
		});
	};

	const [totalPrice, setTotalPrice] = useState(0);
	useEffect(() => {
		let newTotalPrice = 0;

		for (let item of cart) {
			newTotalPrice += item.quantity * item.price;
		}

		setTotalPrice(newTotalPrice);
	}, [cart]);

	// Ship infor
	const [shipInfor, setShipInfor] = useState({
		address: {
			city: { value: '', label: 'Chọn tỉnh / thành phố' },
			district: { value: '', label: 'Chọn quận / huyện' },
			ward: { value: '', label: 'Chọn phường / thị xã / xã' },
			more: ''
		},
		phone: ''
	});

	const handleChangeShipInfor = (value, e) => {
		if (value.target?.name === 'phone') {
			setShipInfor({
				...shipInfor,
				phone: value.target.value
			});
		} else if (e?.name === 'city') {
			setShipInfor({
				...shipInfor,
				address: {
					...shipInfor.address,
					city: value,
					district: { value: '', label: 'Chọn quận / huyện' },
					ward: { value: '', label: 'Chọn phường / thị xã / xã' }
				}
			});
		} else if (e?.name === 'district') {
			setShipInfor({
				...shipInfor,
				address: {
					...shipInfor.address,
					district: value,
					ward: { value: '', label: 'Chọn phường / thị xã / xã' }
				}
			});
		} else if (e?.name === 'ward') {
			setShipInfor({
				...shipInfor,
				address: {
					...shipInfor.address,
					ward: value
				}
			});
		} else {
			setShipInfor({
				...shipInfor,
				address: {
					...shipInfor.address,
					more: value.target.value
				}
			});
		}
	};

	// Cities
	const [cityOptions, setCityOptions] = useState([
		{ label: 'Chọn tỉnh / thành phố', value: '' }
	]);
	useEffect(() => {
		let cities = addressApi
			.fetchCities()
			.map(city => ({ label: city.name, value: city.code }));

		cities.unshift({ label: 'Chọn tỉnh / thành phố', value: '' });
		setCityOptions(cities);
	}, []);

	// Districts
	const [districtOptions, setDistrictOptions] = useState([
		{ label: 'Chọn quận / huyện', value: '' }
	]);

	useEffect(() => {
		if (shipInfor.address.city.value !== '') {
			const districts = addressApi
				.fetchDistricts(shipInfor.address.city.value)
				.map(district => ({
					label: district.name,
					value: district.id,
					prefix: district.prefix
				}));

			districts.unshift({ label: 'Chọn quận / huyện', value: '' });
			setDistrictOptions(districts);
		} else {
			setDistrictOptions([{ label: 'Chọn quận / huyện', value: '' }]);
		}
	}, [shipInfor.address.city]);

	// Wards
	const [wardOptions, setWardOptions] = useState([
		{ label: 'Chọn phường / thị xã / xã', value: '' }
	]);

	useEffect(() => {
		if (shipInfor.address.city.value && shipInfor.address.district.value) {
			const wards = addressApi
				.fetchWards(
					shipInfor.address.city.value,
					shipInfor.address.district.value
				)
				.map(ward => ({ label: ward.name, value: ward.id }));

			wards.unshift({ label: 'Chọn phường / thị xã / xã', value: '' });
			setWardOptions(wards);
		} else {
			setWardOptions([{ label: 'Chọn phường / thị xã / xã', value: '' }]);
		}
	}, [shipInfor.address.city, shipInfor.address.district]);

	// Ship price
	const [shipPrice, setShipPrice] = useState(0);
	useEffect(() => {
		setShipPrice(25000);
	}, [shipInfor.address]);

	// discount price
	const [discountCode, setdiscountCode] = useState('');
	const [discountCard, setdiscountCard] = useState(null);

	const fetchDiscountCard = async () => {
		try {
			const res = await discountApi.fetch(discountCode);

			if (res.status) {
				setdiscountCard(res.discount);
			} else {
				setdiscountCard(null);
				toast.error(res.message);
			}
		} catch (error) {
			alert(error);
		}
	};

	// Final price
	const [finalPrice, setFinalPrice] = useState(0);
	useEffect(() => {
		let newFinalPrice = 0;

		const discountPrice =
			discountCard && discountCard.quantity > 0 && discountCard.status
				? discountCard.price
				: 0;
		newFinalPrice = totalPrice + shipPrice - discountPrice;

		setFinalPrice(newFinalPrice);
	}, [discountCard, shipPrice, totalPrice]);

	// Handle add order
	const handleAddOrder = async () => {
		if (!currentUser) {
			toast.error('Vui lòng đăng nhập để thêm mới đơn hàng!');
			history.push('/dang-nhap');
			return;
		}

		if (!shipInfor.phone) {
			toast.error('Vui lòng nhập số điện thoại nhận hàng!');
			return;
		}

		if (
			!shipInfor.address.city.value ||
			!shipInfor.address.district.value ||
			!shipInfor.address.ward.value ||
			!shipInfor.address.more
		) {
			toast.error('Vui lòng hoàn thành địa chỉ giao hàng!');
			return;
		}

		try {
			let newOrderDetails = [];
			for (let item of cart) {
				newOrderDetails.push({
					phone: item.phone._id,
					rom: item.model.rom,
					ram: item.model.ram,
					color: item.model.color,
					quantity: item.quantity,
					price: item.price
				});
			}

			const newOrder = {
				user: currentUser._id,
				phone: shipInfor.phone,
				address: `${shipInfor.address.more}, ${shipInfor.address.ward.label}, ${shipInfor.address.district.label}, ${shipInfor.address.city.label}`,
				details: newOrderDetails,
				shipPrice,
				discount: discountCard?._id || undefined
			};

			const res = await orderApi.add(newOrder);

			if (res.status) {
				toast.success(res.message);
				dispatch(cartActions.removeAll());
				history.push('/lich-su-dat-hang');
			} else {
				toast.error(res.message);
			}
		} catch (error) {
			console.log(error);
			toast.error('Lỗi hệ thống! Thêm mới đơn hàng không thành công!');
		}
	};

	// Confirm
	const [confirm, setConfirm] = useState({});

	const handleCloseConfirm = () => setConfirm({ ...confirm, show: false });

	// Return
	return (
		<div className="p-5">
			<Confirm
				show={confirm.show}
				title={confirm.title}
				message={confirm.message}
				onSuccess={confirm.onSuccess}
				onClose={confirm.onCancel || handleCloseConfirm}
			/>
			<Row className="g-4">
				<Col xl={cart.length > 0 ? 8 : 12}>
					<div className="bg-white rounded shadow">
						<div className="phdr">Giỏ hàng</div>
						<div className="p-3">
							{cart.length > 0 ? (
								<CartList
									cart={cart}
									handleUpdateCartItem={handleUpdateCartItem}
									handleRemoveCartItem={handleRemoveCartItem}
								/>
							) : (
								<Alert variant="danger" className="mb-0">
									Không có sản phẩm nào!
								</Alert>
							)}
						</div>
					</div>
				</Col>
				{cart.length > 0 && (
					<Col>
						<div className="bg-white rounded shadow mb-3">
							<div className="phdr">Thông tin giao hàng</div>
							<div className="p-3">
								<div>
									<FormGroup className="mb-3">
										<FormLabel>Số điện thoại</FormLabel>
										<FormControl
											name="phone"
											value={shipInfor.phone || ''}
											onChange={handleChangeShipInfor}
										/>
									</FormGroup>
									<FormGroup>
										<FormLabel>Địa chỉ</FormLabel>

										<div className="border rounded p-3">
											<FormGroup className="mb-3">
												<FormLabel>
													Tỉnh / Thành phố
												</FormLabel>
												<Select
													name="city"
													options={cityOptions}
													value={
														shipInfor.address.city
													}
													onChange={
														handleChangeShipInfor
													}
												/>
											</FormGroup>

											<FormGroup className="mb-3">
												<FormLabel>
													Quận / Huyện
												</FormLabel>
												<Select
													name="district"
													options={districtOptions}
													value={
														shipInfor.address
															.district
													}
													onChange={
														handleChangeShipInfor
													}
												/>
											</FormGroup>

											<FormGroup className="mb-3">
												<FormLabel>
													Phường / Thị xã / Xã
												</FormLabel>
												<Select
													name="ward"
													options={wardOptions}
													value={
														shipInfor.address.ward
													}
													onChange={
														handleChangeShipInfor
													}
												/>
											</FormGroup>

											<FormGroup className="mb-3">
												<FormLabel>
													Số nhà, tổ
												</FormLabel>
												<FormControl
													name="more"
													value={
														shipInfor.address.more
													}
													onChange={
														handleChangeShipInfor
													}
												/>
											</FormGroup>

											<Alert
												variant="primary"
												className="d-flex justify-content-between mb-0"
											>
												Phí vận chuyển{' '}
												<span className="fw-bold">
													{formatToVND(shipPrice)}
												</span>
											</Alert>
										</div>
									</FormGroup>
								</div>
							</div>
						</div>

						<div className="bg-white rounded shadow mb-4">
							<div className="phdr">Mã giảm giá</div>
							<div className="p-3">
								<InputGroup>
									<FormControl
										name="discountCode"
										placeholder="Nhập mã giảm giá"
										value={discountCode}
										onChange={e =>
											setdiscountCode(e.target.value)
										}
									/>
									<SplitButton
										icon="fas fa-code"
										text="Kiểm tra"
										onClick={fetchDiscountCard}
									/>
								</InputGroup>
								<div className="mt-3">
									{discountCard ? (
										<Card
											className={
												discountCard.quantity > 0 &&
												discountCard.status
													? 'alert-primary'
													: 'alert-danger'
											}
										>
											<Card.Body className="p-0">
												<div className="fw-bold d-flex justify-content-between">
													<div>
														<i className="fas fa-code me-2"></i>
														{discountCard.code}
													</div>
													<div>
														<Badge
															bg={
																discountCard.status
																	? 'primary'
																	: 'danger'
															}
														>
															{discountCard.status
																? 'Khả dụng'
																: 'Đã khóa'}
														</Badge>
													</div>
												</div>
												<div className="d-flex justify-content-between mt-3">
													<div className="text-center">
														<div
															style={{
																fontSize: 11
															}}
														>
															Tên
														</div>
														<div className="fw-bold">
															{discountCard.name}
														</div>
													</div>

													<div className="text-center">
														<div
															style={{
																fontSize: 11
															}}
														>
															Số lượng
														</div>
														<div className="fw-bold">
															{formatToNumberString(
																discountCard.quantity
															)}
														</div>
													</div>

													<div className="text-center">
														<div
															style={{
																fontSize: 11
															}}
														>
															Giảm
														</div>
														<div className="fw-bold">
															{formatToVND(
																discountCard.price
															)}
														</div>
													</div>
												</div>
											</Card.Body>
										</Card>
									) : (
										<Alert
											variant="danger"
											className="my-0"
										>
											Không có mã giảm giá!
										</Alert>
									)}
								</div>
							</div>
						</div>

						<div className="bg-white rounded shadow">
							<div className="phdr">Thành tiền</div>
							<div className="p-3">
								<div className="d-flex justify-content-between mb-1">
									<span>Tiền hàng</span>
									<span>{formatToVND(totalPrice)}</span>
								</div>
								<div className="d-flex justify-content-between mb-1">
									<span>Vận chuyển</span>
									<span>{formatToVND(shipPrice)}</span>
								</div>
								<div className="d-flex justify-content-between mb-1">
									<span>Giảm giá</span>
									<span>
										{formatToVND(
											discountCard &&
												discountCard.quantity > 0 &&
												discountCard.status
												? discountCard.price
												: 0
										)}
									</span>
								</div>
								<div className="d-flex justify-content-between mb-3">
									<span className="fw-bold">Thành tiền</span>
									<span className="fw-bold text-danger">
										{formatToVND(finalPrice)}
									</span>
								</div>
								<div className="d-grid">
									<Button onClick={handleAddOrder}>
										<i className="fas fa-list-alt me-2" />
										Đặt hàng
									</Button>
								</div>
							</div>
						</div>
					</Col>
				)}
			</Row>
		</div>
	);
};

export default CartPage;
