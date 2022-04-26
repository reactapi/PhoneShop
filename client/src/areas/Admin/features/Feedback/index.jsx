import feedbackApi from 'api/feedbackApi';
import {
	feedbackActions,
	fetchFeedbacks,
	selectFeedbackFilter,
	selectFeedbackLoading,
	selectFeedbackPagination,
	selectFeedbacks,
	selectFeedbackSelectedItems
} from 'app/feedbackSlice';
import { SplitButton } from 'components/Buttons/SplitButton';
import { Confirm, ITMPagination } from 'components/Common/';
import { useEffect, useState } from 'react';
import { Alert, Card, ProgressBar } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FeedbackFilter } from './components/FeedbackFilter';
import { FeedbackList } from './components/FeedbackList';
import FeedbackModal from './components/FeedbackModal';

const FeedbackPage = () => {
	const dispatch = useDispatch();

	// Confirm
	const [confirm, setConfirm] = useState({});

	const handleCloseConfirm = () => {
		setConfirm({ ...confirm, show: false });
	};

	// Loading
	const loading = useSelector(selectFeedbackLoading);
	const [loadingTimmer, setLoadingTimmer] = useState(0.5);
	useEffect(() => {
		setTimeout(() => {
			if (loadingTimmer > 0) setLoadingTimmer(loadingTimmer - 0.1);
		}, 100);
	}, [loadingTimmer]);

	// Filter
	const filter = useSelector(selectFeedbackFilter);

	const handleFilter = formValues => {
		if (loading || loadingTimmer > 0) return;

		const { key, status } = formValues;

		let newFilter = {
			key: key !== '' ? key : undefined,
			status: status !== '' ? status : undefined,
			_page: 1,
			_limit: filter._limit
		};

		dispatch(feedbackActions.setFilter(newFilter));
	};

	const handleResetFilter = () => {
		if (loading || loadingTimmer > 0) return;

		dispatch(
			feedbackActions.setFilter({
				key: undefined,
				status: undefined,
				_page: 1,
				_limit: filter._limit
			})
		);
	};

	// SelectedItems
	const selectedItems = useSelector(selectFeedbackSelectedItems);

	const handleSelectItem = params => {
		if (params.all !== undefined) {
			const newSelectedItems = params.all
				? feedbacks.map(item => item._id)
				: [];

			dispatch(feedbackActions.setSelectedItems(newSelectedItems));
		} else {
			const newSelectedItems = params.checked
				? [...selectedItems, params._id]
				: selectedItems.filter(item => item !== params._id);

			dispatch(feedbackActions.setSelectedItems(newSelectedItems));
		}
	};

	// Fetch data
	const feedbacks = useSelector(selectFeedbacks);
	useEffect(() => {
		setLoadingTimmer(0.5);
		dispatch(fetchFeedbacks(filter));
		dispatch(feedbackActions.setSelectedItems([]));
	}, [dispatch, filter]);

	// Modal
	const [showModal, setShowModal] = useState(false);
	const [viewedFeedback, setViewedFeedback] = useState({});

	const onShowModal = feedback => {
		setViewedFeedback(feedback);
		handleUpdateFeedbackStatus(feedback);

		setShowModal(true);
		dispatch(feedbackActions.setFeedback({ ...feedback, status: true }));
	};

	const onCloseModal = () => setShowModal(false);

	// Update feedback
	const handleUpdateFeedbackStatus = async feedback => {
		try {
			feedbackApi.update(feedback._id);
		} catch (error) {
			console.log('Lỗi hệ thống!');
		}
	};

	// Remove feedback
	const handleRemoveFeedback = async feedback => {
		setConfirm({
			show: true,
			message: (
				<>
					Xóa phản hồi <b>{feedback._id}</b> khỏi hệ thống?
				</>
			),
			onSuccess: async () => {
				try {
					const res = await feedbackApi.remove(feedback._id);

					if (res.status) {
						toast.success(
							<>
								Xóa phản hồi <b>{feedback._id}</b> thành công!
							</>
						);
						dispatch(feedbackActions.setFilter({ ...filter }));
					} else {
						toast.error(
							<>
								Xóa phản hồi <b>{feedback._id}</b> không thành
								công!
							</>
						);
					}
				} catch (error) {
					toast.error(
						<>
							Lỗi hệ thống! Xóa phản hồi <b>{feedback._id}</b>{' '}
							không thành công!
						</>
					);
				}
			}
		});
	};

	const handleRemoveFeedbackSelections = async () => {
		setConfirm({
			show: true,
			message: 'Xóa những phản hồi đã chọn khỏi hệ thống?',
			onSuccess: async () => {
				const removeSuccess = new Promise(async (resolve, reject) => {
					for (let i = 0; i < selectedItems.length; i++) {
						try {
							const res = await feedbackApi.remove(
								selectedItems[i]
							);

							if (res.status) {
								toast.success(
									<>
										Xóa phản hồi <b>{res.feedback._id} </b>
										thành công!
									</>
								);
							} else {
								toast.error(
									<>
										Xóa phản hồi <b>{res.feedback._id} </b>
										không thành công!
									</>
								);
							}

							if (i === selectedItems.length - 1) resolve(true);
						} catch (error) {
							toast.error(
								'Lỗi hệ thống! Xóa phản hồi không thành công!'
							);
						}
					}
				});

				if (await removeSuccess)
					dispatch(feedbackActions.setFilter({ ...filter }));
			}
		});
	};

	// Pagination
	const pagination = useSelector(selectFeedbackPagination);

	const handlePageChange = _page => {
		if (_page !== pagination._page)
			dispatch(
				feedbackActions.setFilter({
					...filter,
					_page,
					_limit: pagination._limit
				})
			);
	};

	// JSX
	const dataJSX = (
		<div className="table-responsive">
			<FeedbackList
				selectedItems={selectedItems}
				feedbacks={feedbacks}
				onSelectItem={handleSelectItem}
				onShowModal={onShowModal}
				onRemoveFeedback={handleRemoveFeedback}
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
			<Card.Header className="fw-bold">Phản Hồi</Card.Header>

			<Card.Body>
				<div>
					<SplitButton
						disabled={selectedItems.length <= 0}
						variant="danger"
						icon="fas fa-fw fa-trash"
						text="Xóa"
						className="mb-3"
						onClick={handleRemoveFeedbackSelections}
					/>
				</div>
				<FeedbackModal
					show={showModal}
					viewedFeedback={viewedFeedback}
					onClose={onCloseModal}
				/>
				<FeedbackFilter
					filter={filter}
					onFilter={handleFilter}
					onReset={handleResetFilter}
				/>
				{loading || loadingTimmer > 0
					? loadingJSX
					: feedbacks.length > 0
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

export default FeedbackPage;
