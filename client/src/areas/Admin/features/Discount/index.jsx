import discountApi from 'api/discountApi';
import {
	discountActions,
	fetchDiscounts,
	selectDiscountFilter,
	selectDiscountLoading,
	selectDiscountPagination,
	selectDiscounts,
	selectDiscountSelectedItems
} from 'app/discountSlice';
import { SplitButton } from 'components/Buttons';
import { Confirm, ITMPagination } from 'components/Common/';
import { useEffect, useState } from 'react';
import { Alert, Card, ProgressBar } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { DiscountFilter, DiscountList, DiscountModal } from './components';

const DiscountPage = () => {
	const dispatch = useDispatch();

	// Confirm
	const [confirm, setConfirm] = useState({});

	const handleCloseConfirm = () => {
		setConfirm({ ...confirm, show: false });
	};

	// Loading
	const loading = useSelector(selectDiscountLoading);
	const [loadingTimmer, setLoadingTimmer] = useState(0.5);
	useEffect(() => {
		setTimeout(() => {
			if (loadingTimmer > 0) setLoadingTimmer(loadingTimmer - 0.1);
		}, 100);
	}, [loadingTimmer]);

	// Filter
	const filter = useSelector(selectDiscountFilter);

	const handleFilter = formValues => {
		if (loading || loadingTimmer > 0) return;

		const { key, code, status } = formValues;

		let newFilter = {
			key: key !== '' ? key : undefined,
			code: code !== '' ? code : undefined,
			status: status !== '' ? status : undefined,
			_page: 1,
			_limit: filter._limit
		};

		dispatch(discountActions.setFilter(newFilter));
	};

	const handleResetFilter = () => {
		if (loading || loadingTimmer > 0) return;

		dispatch(
			discountActions.setFilter({
				key: undefined,
				code: undefined,
				status: undefined,
				_page: 1,
				_limit: filter._limit
			})
		);
	};

	// SelectedItems
	const selectedItems = useSelector(selectDiscountSelectedItems);

	const handleSelectItem = params => {
		if (params.all !== undefined) {
			const newSelectedItems = params.all ? discounts.map(item => item._id) : [];

			dispatch(discountActions.setSelectedItems(newSelectedItems));
		} else {
			const newSelectedItems = params.checked
				? [...selectedItems, params._id]
				: selectedItems.filter(item => item !== params._id);

			dispatch(discountActions.setSelectedItems(newSelectedItems));
		}
	};

	// Fetch data
	const discounts = useSelector(selectDiscounts);
	useEffect(() => {
		setLoadingTimmer(0.5);
		dispatch(fetchDiscounts(filter));
		dispatch(discountActions.setSelectedItems([]));
	}, [dispatch, filter]);

	// Modal
	const [showModal, setShowModal] = useState(false);
	const [updatedDiscount, setUpdatedDiscount] = useState({
		_id: null,
		code: '',
		name: '',
		quantity: '',
		price: '',
		status: true
	});

	const onShowModal = discount => {
		setUpdatedDiscount({
			_id: discount?._id || null,
			code: discount?.code || '',
			name: discount?.name || '',
			quantity: discount?.quantity || 0,
			price: discount?.price || 0,
			status: discount?.status !== undefined ? discount?.status : true
		});

		setShowModal(true);
	};

	const onCloseModal = () => setShowModal(false);

	// Update discount
	const handleUpdateDiscount = async formValues => {
		try {
			const discount = {
				_id: formValues._id || undefined,
				code: formValues.code,
				name: formValues.name,
				quantity: formValues.quantity,
				price: formValues.price,
				status: formValues.status
			};

			const res = discount._id
				? await discountApi.update(discount)
				: await discountApi.add(discount);

			if (res.status) {
				toast.success(res.message);
				setShowModal(false);

				if (discount._id) dispatch(discountActions.setDiscount(res.discount));
				else dispatch(discountActions.setFilter({ ...filter }));
			} else {
				toast.error(res.message);
			}
		} catch (error) {
			toast.error('Lỗi hệ thống!');
		}
	};

	const handleUpdateDiscountStatus = async discount => {
		setConfirm({
			show: true,
			message: (
				<>
					Cập nhật trạng thái hiển thị của phiếu giảm giá <b>{discount.name}</b>?
				</>
			),
			onSuccess: async () => {
				try {
					const newDiscount = {
						_id: discount._id,
						status: !discount.status
					};

					const res = await discountApi.update(newDiscount);

					if (res.status) {
						toast.success(
							<>
								Cập nhật trạng thái hiển thị của phiếu giảm giá{' '}
								<b>{discount.name}</b> thành công!
							</>
						);
						dispatch(discountActions.setDiscount(res.discount));
					} else {
						toast.error(
							<>
								Cập nhật trạng thái hiển thị của phiếu giảm giá{' '}
								<b>{discount.name}</b> không thành công!
							</>
						);
					}
				} catch (error) {
					toast.error(
						<>
							Lỗi hệ thống! Cập nhật trạng thái hiển thị của phiếu giảm giá{' '}
							<b>{discount.name}</b> không thành công!
						</>
					);
				}
			}
		});
	};

	// Remove discount
	const handleRemoveDiscount = async discount => {
		setConfirm({
			show: true,
			message: (
				<>
					Xóa phiếu giảm giá <b>{discount.name}</b> khỏi hệ thống?
				</>
			),
			onSuccess: async () => {
				try {
					const res = await discountApi.remove(discount._id);

					if (res.status) {
						toast.success(res.message);
						dispatch(discountActions.setFilter({ ...filter }));
					} else {
						toast.error(res.message);
					}
				} catch (error) {
					toast.error(
						<>
							Lỗi hệ thống! Xóa phiếu giảm giá <b>{discount.name}</b> không thành
							công!
						</>
					);
				}
			}
		});
	};

	const handleRemoveDiscountSelections = async () => {
		setConfirm({
			show: true,
			message: 'Xóa những phiếu giảm giá đã chọn khỏi hệ thống?',
			onSuccess: async () => {
				const removeSuccess = new Promise(async (resolve, reject) => {
					for (let i = 0; i < selectedItems.length; i++) {
						try {
							const res = await discountApi.remove(selectedItems[i]);

							if (res.status) {
								toast.success(
									<>
										Xóa phiếu giảm giá <b>{res.discount.name} </b>thành công!
									</>
								);
							} else {
								toast.error(
									<>
										Xóa phiếu giảm giá <b>{res.discount.name} </b>không thành
										công!
									</>
								);
							}

							if (i === selectedItems.length - 1) resolve(true);
						} catch (error) {
							toast.error('Lỗi hệ thống! Xóa phiếu giảm giá không thành công!');
						}
					}
				});

				if (await removeSuccess) dispatch(discountActions.setFilter({ ...filter }));
			}
		});
	};

	// Pagination
	const pagination = useSelector(selectDiscountPagination);

	const handlePageChange = _page => {
		if (_page !== pagination._page)
			dispatch(
				discountActions.setFilter({
					...filter,
					_page,
					_limit: pagination._limit
				})
			);
	};

	// JSX
	const dataJSX = (
		<div className="table-responsive">
			<DiscountList
				selectedItems={selectedItems}
				discounts={discounts}
				onSelectItem={handleSelectItem}
				onShowModal={onShowModal}
				onUpdateDiscountStatus={handleUpdateDiscountStatus}
				onRemoveDiscount={handleRemoveDiscount}
			/>
			<ITMPagination size="sm" pagination={pagination} onChange={handlePageChange} />
		</div>
	);
	const noDataJSX = <Alert variant="danger">Không có dữ liệu</Alert>;
	const loadingJSX = <ProgressBar animated now={100}></ProgressBar>;

	return (
		<Card className="shadow mb-4">
			<Card.Header className="fw-bold">Phiếu Giảm Giá</Card.Header>

			<Card.Body>
				<div>
					<SplitButton
						icon="fas fa-fw fa-plus"
						text="Thêm mới"
						className="mb-3 me-2"
						onClick={() => onShowModal(null)}
					/>
					<SplitButton
						disabled={selectedItems.length <= 0}
						variant="danger"
						icon="fas fa-fw fa-trash"
						text="Xóa"
						className="mb-3"
						onClick={handleRemoveDiscountSelections}
					/>
				</div>
				<DiscountModal
					show={showModal}
					initialValues={updatedDiscount}
					onClose={onCloseModal}
					onSubmit={handleUpdateDiscount}
				/>
				<DiscountFilter
					filter={filter}
					onFilter={handleFilter}
					onReset={handleResetFilter}
				/>
				{loading || loadingTimmer > 0
					? loadingJSX
					: discounts.length > 0
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

export default DiscountPage;
