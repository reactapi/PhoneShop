import { SplitButton } from 'components/Buttons/SplitButton';
import { Button, Col, InputGroup, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { formatToVND } from 'utils';

export const CartList = props => {
	const { cart, handleUpdateCartItem, handleRemoveCartItem } = props;

	const handleReduceQuantity = item => {
		if (item.quantity === 1) {
			handleRemoveCartItem(item);
			return;
		}

		handleUpdateCartItem({
			...item,
			quantity: item.quantity - 1
		});
	};

	const handleIncreaseQuantity = item => {
		handleUpdateCartItem({
			...item,
			quantity: item.quantity + 1
		});
	};

	return cart.map((item, index) => (
		<div className="border rounded g-2 mb-3 p-4 shadow-sm" key={index}>
			<Row>
				<Col md="auto" className="d-flex justify-content-center">
					<Link
						to={`/dien-thoai/${item.phone.category.metaTitle}/${item.phone.metaTitle}`}
					>
						<img
							src={
								item.phone.photos.filter(
									photo => photo.title === item.model.color
								)[0].url
							}
							alt={item.phone.name}
							width={170}
							height={110}
						/>
					</Link>
				</Col>
				<Col>
					<div className="fw-bold">{item.phone.name}</div>
					<div className="d-flex justify-content-between">
						<div className="mt-1 d-flex">
							<div className="me-4">
								<div className="small" style={{ fontSize: 11 }}>
									Rom
								</div>
								<div
									className="fw-bold"
									style={{ fontSize: 13 }}
								>
									{item.model.rom}
								</div>
							</div>

							<div className="me-4">
								<div className="small" style={{ fontSize: 11 }}>
									Ram
								</div>
								<div
									className="fw-bold"
									style={{ fontSize: 13 }}
								>
									{item.model.ram}
								</div>
							</div>

							<div className="me-4">
								<div className="small" style={{ fontSize: 11 }}>
									Màu
								</div>
								<div
									className="fw-bold"
									style={{ fontSize: 13 }}
								>
									{item.model.color}
								</div>
							</div>

							<div className="me-4">
								<div className="small" style={{ fontSize: 11 }}>
									Giá
								</div>
								<div
									className="fw-bold"
									style={{ fontSize: 13 }}
								>
									{formatToVND(item.price)}
								</div>
							</div>

							<div>
								<div className="small" style={{ fontSize: 11 }}>
									Thành tiền
								</div>
								<div
									className="fw-bold text-danger"
									style={{ fontSize: 13 }}
								>
									{formatToVND(item.price * item.quantity)}
								</div>
							</div>
						</div>
					</div>
					<div className="mt-2 d-flex">
						<span>
							<InputGroup size="sm">
								<Button
									variant="outline-primary"
									className="px-3"
									onClick={() => handleReduceQuantity(item)}
								>
									-
								</Button>
								<InputGroup.Text className="bg-white border border-primary text-primary px-3">
									{item.quantity}
								</InputGroup.Text>
								<Button
									variant="outline-primary"
									className="px-3"
									onClick={() => handleIncreaseQuantity(item)}
								>
									+
								</Button>
							</InputGroup>
						</span>
						<SplitButton
							size="sm"
							icon="fas fa-trash"
							variant="danger"
							text="Xóa"
							className="ms-2"
							onClick={() => handleRemoveCartItem(item)}
						/>
					</div>
				</Col>
			</Row>
		</div>
	));
};
