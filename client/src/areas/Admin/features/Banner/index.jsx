import bannerApi from 'api/bannerApi';
import {
	bannerActions,
	fetchBanners,
	selectBanners,
	selectBannerFilter,
	selectBannerLoading,
	selectBannerPagination,
	selectBannerSelectedItems
} from 'app/bannerSlice';
import { SplitButton } from 'components/Buttons/SplitButton';
import { Confirm, ITMPagination } from 'components/Common/';
import { useEffect, useState } from 'react';
import { Alert, Card, ProgressBar } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { BannerFilter, BannerList, BannerModal } from './components';

const BannerPage = () => {
	const dispatch = useDispatch();

	// Confirm
	const [confirm, setConfirm] = useState({});

	const handleCloseConfirm = () => {
		setConfirm({ ...confirm, show: false });
	};

	// Loading
	const loading = useSelector(selectBannerLoading);
	const [loadingTimmer, setLoadingTimmer] = useState(0.5);
	useEffect(() => {
		setTimeout(() => {
			if (loadingTimmer > 0) setLoadingTimmer(loadingTimmer - 0.1);
		}, 100);
	}, [loadingTimmer]);

	// Filter
	const filter = useSelector(selectBannerFilter);

	const handleFilter = formValues => {
		if (loading || loadingTimmer > 0) return;

		const { key, status } = formValues;

		let newFilter = {
			key: key !== '' ? key : undefined,
			status: status !== '' ? status : undefined,
			_page: 1,
			_limit: filter._limit
		};

		dispatch(bannerActions.setFilter(newFilter));
	};

	const handleResetFilter = () => {
		if (loading || loadingTimmer > 0) return;

		dispatch(
			bannerActions.setFilter({
				key: undefined,
				status: undefined,
				_page: 1,
				_limit: filter._limit
			})
		);
	};

	// SelectedItems
	const selectedItems = useSelector(selectBannerSelectedItems);

	const handleSelectItem = params => {
		if (params.all !== undefined) {
			const newSelectedItems = params.all
				? banners.map(item => item._id)
				: [];

			dispatch(bannerActions.setSelectedItems(newSelectedItems));
		} else {
			const newSelectedItems = params.checked
				? [...selectedItems, params._id]
				: selectedItems.filter(item => item !== params._id);

			dispatch(bannerActions.setSelectedItems(newSelectedItems));
		}
	};

	// Fetch data
	const banners = useSelector(selectBanners);
	useEffect(() => {
		setLoadingTimmer(0.5);
		dispatch(fetchBanners(filter));
		dispatch(bannerActions.setSelectedItems([]));
	}, [dispatch, filter]);

	// Modal
	const [showModal, setShowModal] = useState(false);
	const [updatedBanner, setUpdatedBanner] = useState({
		_id: null,
		title: '',
		image: '',
		url: '',
		order: '',
		status: true
	});

	const onShowModal = banner => {
		setUpdatedBanner({
			_id: banner?._id || null,
			title: banner?.title || '',
			image: banner?.image || '/images/no-phone-photo.png',
			url: banner?.url || '/',
			order: banner?.order || 1,
			status: banner?.status !== undefined ? banner?.status : true
		});

		setShowModal(true);
	};

	const onCloseModal = () => setShowModal(false);

	// Update banner
	const handleUpdateBanner = async formValues => {
		try {
			const banner = {
				_id: formValues._id || undefined,
				title: formValues.title,
				image: formValues.image,
				url: formValues.url,
				order: formValues.order,
				status: formValues.status
			};

			const res = banner._id
				? await bannerApi.update(banner)
				: await bannerApi.add(banner);

			if (res.status) {
				toast.success(res.message);
				setShowModal(false);
				if (banner._id) dispatch(bannerActions.setBanner(res.banner));
				else dispatch(bannerActions.setFilter({ ...filter }));
			} else {
				toast.error(res.message);
			}
		} catch (error) {
			toast.error('Lỗi hệ thống!');
		}
	};

	const handleUpdateBannerStatus = async banner => {
		setConfirm({
			show: true,
			message: (
				<>
					Cập nhật trạng thái hiển thị của bìa quảng cáo{' '}
					<b>{banner._id}</b>?
				</>
			),
			onSuccess: async () => {
				try {
					const newBanner = {
						_id: banner._id,
						status: !banner.status
					};

					const res = await bannerApi.update(newBanner);

					if (res.status) {
						toast.success(
							<>
								Cập nhật trạng thái hiển thị của bìa quảng cáo{' '}
								<b>{banner._id}</b> thành công!
							</>
						);
						dispatch(bannerActions.setBanner(res.banner));
					} else {
						toast.error(
							<>
								Cập nhật trạng thái hiển thị của bìa quảng cáo{' '}
								<b>{banner._id}</b> không thành công!
							</>
						);
					}
				} catch (error) {
					toast.error(
						<>
							Lỗi hệ thống! Cập nhật trạng thái hiển thị của danh
							mục <b>{banner._id}</b> thành công!
						</>
					);
				}
			}
		});
	};

	// Remove banner
	const handleRemoveBanner = async banner => {
		setConfirm({
			show: true,
			message: (
				<>
					Xóa bìa quảng cáo <b>{banner._id}</b> khỏi hệ thống?
				</>
			),
			onSuccess: async () => {
				try {
					const res = await bannerApi.remove(banner._id);

					if (res.status) {
						toast.success(
							<>
								Xóa bìa quảng cáo <b>{banner._id}</b> thành
								công!
							</>
						);
						dispatch(bannerActions.setFilter({ ...filter }));
					} else {
						toast.error(
							<>
								Xóa bìa quảng cáo <b>{banner._id}</b> không
								thành công!
							</>
						);
					}
				} catch (error) {
					toast.error(
						<>
							Lỗi hệ thống! Xóa bìa quảng cáo <b>{banner._id}</b>{' '}
							không thành công!
						</>
					);
				}
			}
		});
	};

	const handleRemoveCategorySelections = async () => {
		setConfirm({
			show: true,
			message: 'Xóa những bìa quảng cáo đã chọn khỏi hệ thống?',
			onSuccess: async () => {
				const removeSuccess = new Promise(async (resolve, reject) => {
					for (let i = 0; i < selectedItems.length; i++) {
						try {
							const res = await bannerApi.remove(
								selectedItems[i]
							);

							if (res.status) {
								toast.success(
									<>
										Xóa bìa quảng cáo{' '}
										<b>{res.banner._id} </b>
										thành công!
									</>
								);
							} else {
								toast.error(
									<>
										Xóa bìa quảng cáo{' '}
										<b>{res.banner._id} </b>
										không thành công!
									</>
								);
							}

							if (i === selectedItems.length - 1) resolve(true);
						} catch (error) {
							toast.error(
								'Lỗi hệ thống! Xóa bìa quảng cáo không thành công!'
							);
						}
					}
				});

				if (await removeSuccess)
					dispatch(bannerActions.setFilter({ ...filter }));
			}
		});
	};

	// Pagination
	const pagination = useSelector(selectBannerPagination);

	const handlePageChange = _page => {
		if (_page !== pagination._page)
			dispatch(
				bannerActions.setFilter({
					...filter,
					_page,
					_limit: pagination._limit
				})
			);
	};

	// JSX
	const dataJSX = (
		<div className="table-responsive">
			<BannerList
				selectedItems={selectedItems}
				banners={banners}
				onSelectItem={handleSelectItem}
				onShowModal={onShowModal}
				onUpdateBannerStatus={handleUpdateBannerStatus}
				onRemoveBanner={handleRemoveBanner}
			/>
			<ITMPagination
				size="sm"
				pagination={pagination}
				onChange={handlePageChange}
			/>
		</div>
	);
	const noDataJSX = <Alert variant="danger">Không có dữ liệu</Alert>;
	const loadingJSX = <ProgressBar animated now={100}></ProgressBar>;

	return (
		<Card className="shadow mb-4">
			<Card.Header className="fw-bold">Bìa Quảng Cáo</Card.Header>

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
						onClick={handleRemoveCategorySelections}
					/>
				</div>
				<BannerModal
					show={showModal}
					initialValues={updatedBanner}
					onClose={onCloseModal}
					onSubmit={handleUpdateBanner}
				/>
				<BannerFilter
					filter={filter}
					onFilter={handleFilter}
					onReset={handleResetFilter}
				/>
				{loading || loadingTimmer > 0
					? loadingJSX
					: banners.length > 0
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

export default BannerPage;
