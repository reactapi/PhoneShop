import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { formatToVND } from 'utils';

export const PhoneList = ({ phones }) => {
	return (
		<Row className="py-4">
			{phones.map(phone => {
				// Min max price
				const getPrice = () => {
					let minPrice = phone.models[0].price;
					let maxPrice = phone.models[0].price;

					for (let model of phone.models) {
						if (model.price < minPrice) minPrice = model.price;
						if (model.price > maxPrice) maxPrice = model.price;
					}

					return { minPrice, maxPrice };
				};

				const { minPrice, maxPrice } = getPrice();
				const promotionPrice = phone.promotionPrice;

				// Price JSX
				let priceJSX;

				if (minPrice === maxPrice) {
					if (promotionPrice) {
						priceJSX = (
							<>
								<div className="fw-bold">
									{formatToVND(minPrice - promotionPrice)}
								</div>
								<div className="fs-7 text-decoration-line-through">
									{formatToVND(minPrice)}
								</div>
							</>
						);
					} else {
						priceJSX = (
							<div className="fw-bold">
								{formatToVND(minPrice)}
							</div>
						);
					}
				} else {
					if (promotionPrice) {
						priceJSX = (
							<>
								<div className="fw-bold">
									{formatToVND(minPrice - promotionPrice)}
									&nbsp;-&nbsp;
									{formatToVND(maxPrice - promotionPrice)}
								</div>
								<div className="fs-7 text-decoration-line-through">
									{formatToVND(minPrice)} -{' '}
									{formatToVND(maxPrice)}
								</div>
							</>
						);
					} else {
						priceJSX = (
							<div className="fw-bold">
								{formatToVND(minPrice)} -{' '}
								{formatToVND(maxPrice)}
							</div>
						);
					}
				}

				return (
					<Col key={phone._id} sm={6} md={4} xl={3} className="mb-4">
						<Link
							to={`/dien-thoai/${phone.category.metaTitle}/${phone.metaTitle}`}
							className="text-dark"
						>
							<div className="text-center">
								<div className="my-3">
									<img
										src={phone.photos[0].url}
										alt={phone.name}
										style={{
											width: 250,
											maxWidth: '100%',
											maxHeight: 167
										}}
									/>
								</div>
								<div>{phone.name}</div>
								<div>{priceJSX}</div>
							</div>
						</Link>
					</Col>
				);
			})}
		</Row>
	);
};
