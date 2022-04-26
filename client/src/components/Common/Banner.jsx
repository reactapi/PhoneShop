import bannerApi from 'api/bannerApi';
import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-bootstrap';

const Banner = () => {
	const [banners, setBanners] = useState([]);
	useEffect(() => {
		const fetchBanners = async () => {
			const res = await bannerApi.fetchList({ status: true });

			setBanners(res.data || []);
		};

		fetchBanners();
	}, []);

	const [index, setIndex] = useState(0);

	const handleSelect = (selectedIndex, e) => {
		setIndex(selectedIndex);
	};

	return (
		<Carousel
			activeIndex={index}
			onSelect={handleSelect}
			className="mb-4 bg-white rounded shadow"
			variant="dark"
		>
			{banners.map(banner => (
				<Carousel.Item key={banner._id}>
					<img
						className="d-block w-100 rounded"
						src={banner.image}
						alt={banner.title}
						height={400}
					/>
				</Carousel.Item>
			))}
		</Carousel>
	);
};

export default Banner;
