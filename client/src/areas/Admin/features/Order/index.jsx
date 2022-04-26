import orderApi from 'api/orderApi';
import {
	fetchOrders,
	orderActions,
	selectOrderFilter,
	selectOrderLoading,
	selectOrderPagination,
	selectOrders
} from 'app/orderSlice';
import { Confirm, ITMPagination } from 'components/Common/';
import { useEffect, useState } from 'react';
import { Alert, Card, ProgressBar } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { OrderFilter, OrderList, OrderViewModal } from './components';

const Order = () => {
	const dispatch = useDispatch();

	// Confirm
	const [confirm, setConfirm] = useState({});

	const handleCloseConfirm = () => {
		setConfirm({ show: false });
	};

	// Loading
	const loading = useSelector(selectOrderLoading);
	const [loadingTimmer, setLoadingTimmer] = useState(0.5);

	useEffect(() => {
		setTimeout(() => {
			if (loadingTimmer > 0) setLoadingTimmer(loadingTimmer - 0.1);
		}, 100);
	}, [loadingTimmer]);

	// Filter
	const filter = useSelector(selectOrderFilter);

	const handleFilter = formValues => {
		if (loading || loadingTimmer > 0) return;

		const { key, phone, status } = formValues;

		let newFilter = {
			key: key !== '' ? key : undefined,
			phone: phone !== '' ? phone : undefined,
			status: status !== '' ? status : undefined,
			_page: 1,
			_limit: filter._limit
		};

		dispatch(orderActions.setFilter(newFilter));
	};

	const handleResetFilter = () => {
		if (loading || loadingTimmer > 0) return;

		dispatch(
			orderActions.setFilter({
				key: undefined,
				phone: undefined,
				status: undefined,
				_page: 1,
				_limit: filter._limit
			})
		);
	};

	// fetch orders
	const orders = useSelector(selectOrders);

	useEffect(() => {
		setLoadingTimmer(0.5);
		dispatch(fetchOrders(filter));
	}, [dispatch, filter]);

	// Pagination
	const pagination = useSelector(selectOrderPagination);

	const handlePageChange = _page => {
		if (_page !== pagination._page)
			dispatch(
				orderActions.setFilter({
					...filter,
					_page,
					_limit: pagination._limit
				})
			);
	};

	// View modal
	const [showViewModal, setShowViewModal] = useState(false);
	const [viewedOrder, setViewedOrder] = useState({});

	const handleShowViewModal = order => {
		setViewedOrder(order);
		setShowViewModal(true);
	};
	const handleCloseViewModal = () => setShowViewModal(false);

	const handleUpdateOrderStatus = async order => {
		setConfirm({
			show: true,
			message: (
				<>
					Cập nhật trạng thái đơn hàng <b>{order._id}</b>?
				</>
			),
			onSuccess: async () => {
				try {
					const res = await orderApi.update(order);

					if (res.status) {
						toast.success(
							<>
								Cập nhật trạng thái đơn hàng <b>{order._id}</b> thành công!
							</>
						);
						dispatch(orderActions.setFilter({ ...filter }));
					} else {
						toast.error(
							<>
								Cập nhật trạng thái đơn hàng <b>{order._id}</b> không thành công!
							</>
						);
					}
				} catch (error) {
					toast.error(
						<>
							Lỗi hệ thống! Cập nhật trạng thái đơn hàng <b>{order._id}</b> không
							thành công!
						</>
					);
				}
			}
		});
	};

	// JSX
	const dataJSX = (
		<div>
			<OrderList
				orders={orders}
				handleShowViewModal={handleShowViewModal}
				handleUpdateOrderStatus={handleUpdateOrderStatus}
			/>
			<ITMPagination size="sm" pagination={pagination} onChange={handlePageChange} />
		</div>
	);
	const noDataJSX = <Alert variant="danger">Không có dữ liệu</Alert>;
	const loadingJSX = <ProgressBar animated now={100}></ProgressBar>;

	// Return
	return (
		<Card className="shadow mb-3">
			<Card.Header className="fw-bold">Đơn Hàng</Card.Header>
			<Card.Body>
				<OrderViewModal
					show={showViewModal}
					order={viewedOrder}
					onClose={handleCloseViewModal}
				/>
				<OrderFilter filter={filter} onFilter={handleFilter} onReset={handleResetFilter} />
				{loading || loadingTimmer > 0
					? loadingJSX
					: orders.length > 0
					? dataJSX
					: noDataJSX}

				<Confirm
					show={confirm.show}
					title={confirm.title}
					message={confirm.message}
					onClose={handleCloseConfirm}
					onCancel={confirm.onCancel}
					onSuccess={confirm.onSuccess}
				/>
			</Card.Body>
		</Card>
	);
};

export default Order;
