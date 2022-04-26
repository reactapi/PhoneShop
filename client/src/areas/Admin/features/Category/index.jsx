import categoryApi from 'api/categoryApi';
import {
	categoryActions,
	fetchCategories,
	selectCategories,
	selectCategoryFilter,
	selectCategoryLoading,
	selectCategoryPagination,
	selectCategorySelectedItems
} from 'app/categorySlice';
import { SplitButton } from 'components/Buttons/SplitButton';
import { Confirm, ITMPagination } from 'components/Common/';
import { useEffect, useState } from 'react';
import { Alert, Card, ProgressBar } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { CategoryFilter, CategoryList, CategoryModal } from './components';

const CategoryPage = () => {
	const dispatch = useDispatch();

	// Confirm
	const [confirm, setConfirm] = useState({});

	const handleCloseConfirm = () => {
		setConfirm({ ...confirm, show: false });
	};

	// Loading
	const loading = useSelector(selectCategoryLoading);
	const [loadingTimmer, setLoadingTimmer] = useState(0.5);
	useEffect(() => {
		setTimeout(() => {
			if (loadingTimmer > 0) setLoadingTimmer(loadingTimmer - 0.1);
		}, 100);
	}, [loadingTimmer]);

	// Filter
	const filter = useSelector(selectCategoryFilter);

	const handleFilter = formValues => {
		if (loading || loadingTimmer > 0) return;

		const { key, parent, status } = formValues;

		let newFilter = {
			key: key !== '' ? key : undefined,
			parent: parent !== '' ? parent : undefined,
			status: status !== '' ? status : undefined,
			_page: 1,
			_limit: filter._limit
		};

		dispatch(categoryActions.setFilter(newFilter));
	};

	const handleResetFilter = () => {
		if (loading || loadingTimmer > 0) return;

		dispatch(
			categoryActions.setFilter({
				key: undefined,
				parent: undefined,
				status: undefined,
				_page: 1,
				_limit: filter._limit
			})
		);
	};

	// SelectedItems
	const selectedItems = useSelector(selectCategorySelectedItems);

	const handleSelectItem = params => {
		if (params.all !== undefined) {
			const newSelectedItems = params.all ? categories.map(item => item._id) : [];

			dispatch(categoryActions.setSelectedItems(newSelectedItems));
		} else {
			const newSelectedItems = params.checked
				? [...selectedItems, params._id]
				: selectedItems.filter(item => item !== params._id);

			dispatch(categoryActions.setSelectedItems(newSelectedItems));
		}
	};

	// Fetch data
	const categories = useSelector(selectCategories);
	useEffect(() => {
		setLoadingTimmer(0.5);
		dispatch(fetchCategories(filter));
		dispatch(categoryActions.setSelectedItems([]));
	}, [dispatch, filter]);

	// Modal
	const [showModal, setShowModal] = useState(false);
	const [updatedCategory, setUpdatedCategory] = useState({
		_id: null,
		name: '',
		parent: '',
		status: true
	});

	const onShowModal = category => {
		setUpdatedCategory({
			_id: category?._id || null,
			name: category?.name || '',
			parent: category?.parent?._id || '',
			status: category?.status !== undefined ? category?.status : true
		});

		setShowModal(true);
	};

	const onCloseModal = () => setShowModal(false);

	// Update category
	const handleUpdateCategory = async formValues => {
		try {
			const category = {
				_id: formValues._id || undefined,
				name: formValues.name,
				parent: formValues.parent !== '' ? formValues.parent : null,
				status: formValues.status
			};

			const res = category._id
				? await categoryApi.update(category)
				: await categoryApi.add(category);

			if (res.status) {
				toast.success(res.message);
				setShowModal(false);
				if (category._id) dispatch(categoryActions.setCategory(res.category));
				else dispatch(categoryActions.setFilter({ ...filter }));
			} else {
				toast.error(res.message);
			}
		} catch (error) {
			toast.error('Lỗi hệ thống!');
		}
	};

	const handleUpdateCategoryStatus = async category => {
		setConfirm({
			show: true,
			message: (
				<>
					Cập nhật trạng thái hiển thị của danh mục <b>{category.name}</b>?
				</>
			),
			onSuccess: async () => {
				try {
					const newCategory = {
						_id: category._id,
						status: !category.status
					};

					const res = await categoryApi.update(newCategory);

					if (res.status) {
						toast.success(
							<>
								Cập nhật trạng thái hiển thị của danh mục <b>{category.name}</b>{' '}
								thành công!
							</>
						);
						dispatch(categoryActions.setCategory(res.category));
					} else {
						toast.error(
							<>
								Cập nhật trạng thái hiển thị của danh mục <b>{category.name}</b>{' '}
								không thành công!
							</>
						);
					}
				} catch (error) {
					toast.error(
						<>
							Lỗi hệ thống! Cập nhật trạng thái hiển thị của danh mục{' '}
							<b>{category.name}</b> thành công!
						</>
					);
				}
			}
		});
	};

	// Remove category
	const handleRemoveCategory = async category => {
		setConfirm({
			show: true,
			message: (
				<>
					Xóa danh mục <b>{category.name}</b> khỏi hệ thống?
				</>
			),
			onSuccess: async () => {
				try {
					const res = await categoryApi.remove(category._id);

					if (res.status) {
						toast.success(
							<>
								Xóa danh mục <b>{category.name}</b> thành công!
							</>
						);
						dispatch(categoryActions.setFilter({ ...filter }));
					} else {
						toast.error(
							<>
								Xóa danh mục <b>{category.name}</b> không thành công!
							</>
						);
					}
				} catch (error) {
					toast.error(
						<>
							Lỗi hệ thống! Xóa danh mục <b>{category.name}</b> không thành công!
						</>
					);
				}
			}
		});
	};

	const handleRemoveCatgorySelections = async () => {
		setConfirm({
			show: true,
			message: 'Xóa những danh mục đã chọn khỏi hệ thống?',
			onSuccess: async () => {
				const removeSuccess = new Promise(async (resolve, reject) => {
					for (let i = 0; i < selectedItems.length; i++) {
						try {
							const res = await categoryApi.remove(selectedItems[i]);

							if (res.status) {
								toast.success(
									<>
										Xóa danh mục <b>{res.category.name} </b>thành công!
									</>
								);
							} else {
								toast.error(
									<>
										Xóa danh mục <b>{res.category.name} </b>không thành công!
									</>
								);
							}

							if (i === selectedItems.length - 1) resolve(true);
						} catch (error) {
							toast.error('Lỗi hệ thống! Xóa danh mục không thành công!');
						}
					}
				});

				if (await removeSuccess) dispatch(categoryActions.setFilter({ ...filter }));
			}
		});
	};

	// Pagination
	const pagination = useSelector(selectCategoryPagination);

	const handlePageChange = _page => {
		if (_page !== pagination._page)
			dispatch(
				categoryActions.setFilter({
					...filter,
					_page,
					_limit: pagination._limit
				})
			);
	};

	// JSX
	const dataJSX = (
		<div className="table-responsive">
			<CategoryList
				selectedItems={selectedItems}
				categories={categories}
				onSelectItem={handleSelectItem}
				onShowModal={onShowModal}
				onUpdateCategoryStatus={handleUpdateCategoryStatus}
				onRemoveCategory={handleRemoveCategory}
			/>
			<ITMPagination size="sm" pagination={pagination} onChange={handlePageChange} />
		</div>
	);
	const noDataJSX = <Alert variant="danger">Không có dữ liệu</Alert>;
	const loadingJSX = <ProgressBar animated now={100}></ProgressBar>;

	return (
		<Card className="shadow mb-4">
			<Card.Header className="fw-bold">Danh Mục</Card.Header>

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
						onClick={handleRemoveCatgorySelections}
					/>
				</div>
				<CategoryModal
					show={showModal}
					initialValues={updatedCategory}
					onClose={onCloseModal}
					onSubmit={handleUpdateCategory}
				/>
				<CategoryFilter
					filter={filter}
					onFilter={handleFilter}
					onReset={handleResetFilter}
				/>
				{loading || loadingTimmer > 0
					? loadingJSX
					: categories.length > 0
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

export default CategoryPage;
