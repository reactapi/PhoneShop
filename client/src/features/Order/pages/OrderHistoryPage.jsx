import { selectAuthLoading, selectCurrentUser } from 'app/authSlice';
import { fetchOrders, selectOrders } from 'app/orderSlice';
import { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { toast } from 'react-toastify';
import { OrderList, OrderViewModal } from '../components';

const OrderHistoryPage = () => {
	const [mode, setMode] = useState('unpaid');

	const history = useHistory();
	const dispatch = useDispatch();
	const orders = useSelector(selectOrders);

	const userLoading = useSelector(selectAuthLoading);
	const currentUser = useSelector(selectCurrentUser);

	useEffect(() => {
		if (!userLoading && !currentUser?._id) {
			toast.error('Vui lòng đăng nhập để xem lịch sử đặt hàng!');
			history.push('/dang-nhap');
			return;
		}

		dispatch(
			fetchOrders({
				user: currentUser?._id || undefined,
				status: mode === 'paid' ? true : false,
				_page: 1,
				_limit: 10
			})
		);
	}, [dispatch, history, userLoading, currentUser?._id, mode]);

	const TabItem = ({ name, title }) => {
		return (
			<button
				className={`bg-white border-0 fw-bold${
					name === mode ? ' text-primary' : ' text-dark'
				}`}
				onClick={() => setMode(name)}
			>
				{title}
			</button>
		);
	};

	// Modal
	const [showViewModal, setShowViewModal] = useState(false);
	const [viewedOrder, setViewedOrder] = useState({});

	const handleShowViewModal = order => {
		setViewedOrder(order);
		setShowViewModal(true);
	};
	const handleCloseViewModal = () => setShowViewModal(false);

	// Return
	return (
		<div className="p-5">
			<div className="bg-white rounded shadow p-3">
				<div className="pt-1 pb-2 border-bottom border-light hstack gap-3">
					<TabItem name="unpaid" title="Chưa thanh toán" />
					<div className="vr" />
					<TabItem name="paid" title="Đã thanh toán" />
				</div>

				<OrderViewModal
					order={viewedOrder}
					show={showViewModal}
					onClose={handleCloseViewModal}
				/>
				<div className="pt-2">
					{orders.length > 0 ? (
						<OrderList
							orders={orders}
							handleShowViewModal={handleShowViewModal}
						/>
					) : (
						<Alert variant="danger" className="mt-2 mb-0">
							Không có đơn hàng nào!
						</Alert>
					)}
				</div>
			</div>
		</div>
	);
};

export default OrderHistoryPage;
