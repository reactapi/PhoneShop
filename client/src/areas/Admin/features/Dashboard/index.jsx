import orderApi from 'api/orderApi';
import {
	fetchStatistics,
	fetchTopCustomers,
	selectDashboardStatistics,
	selectDashboardTopCustomers
} from 'app/dashboard';
import { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { StatisticItem, TopCustomer, TopPhone } from './components';

const DashboardPage = () => {
	const dispatch = useDispatch();

	// Statistics
	const statistics = useSelector(selectDashboardStatistics);
	useEffect(() => {
		dispatch(fetchStatistics());
	}, [dispatch]);

	// Top customers
	const topCustomers = useSelector(selectDashboardTopCustomers);
	useEffect(() => {
		dispatch(fetchTopCustomers(5));
	}, [dispatch]);

	// Top phones
	const [topPhones, setTopPhones] = useState([]);
	useEffect(() => {
		const fetchData = async () => {
			const res = await orderApi.fetchTopPhones(5);

			setTopPhones(res.data);
		};

		fetchData();
	}, []);

	// Return
	return (
		<div>
			{statistics.loading ? null : (
				<Row className="g-3 mb-4">
					<StatisticItem
						color="primary"
						icon="fas fa-user"
						title="Khách hàng"
						value={statistics.customerQuantity}
					/>
					<StatisticItem
						color="danger"
						icon="fas fa-crown"
						title="Nhân viên"
						value={statistics.adminQuantity}
					/>
					<StatisticItem
						color="warning"
						icon="fas fa-mobile-button"
						title="Điện thoại"
						value={statistics.phoneQuantity}
					/>
				</Row>
			)}

			<Row className="mb-4 g-3">
				<Col lg={6}>
					{topCustomers.loading ? null : (
						<TopCustomer topCustomers={topCustomers.data} />
					)}
				</Col>

				<Col lg={6}>
					{topPhones.loading ? null : (
						<TopPhone topPhones={topPhones} />
					)}
				</Col>
			</Row>
		</div>
	);
};

export default DashboardPage;
