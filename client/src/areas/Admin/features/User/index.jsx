import userApi from 'api/userApi';
import {
	fetchUsers,
	selectUserFilter,
	selectUserLoading,
	selectUserPagination,
	selectUsers,
	selectUserSelectedItems,
	userActions
} from 'app/userSlice';
import { SplitButton } from 'components/Buttons';
import { Confirm, ITMPagination } from 'components/Common/';
import { useEffect, useState } from 'react';
import { Alert, Card, ProgressBar } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { formatToVNDate } from 'utils';
import { UserList, UserModal } from './components';
import { UserFilter } from './components/UserFilter';

const UserPage = props => {
	const { isAdmin } = props;
	const dispatch = useDispatch();

	// Confirm
	const [confirm, setConfirm] = useState({});

	const handleCloseConfirm = () => {
		setConfirm({ ...confirm, show: false });
	};

	// Loading
	const loading = useSelector(selectUserLoading);
	const [loadingTimmer, setLoadingTimmer] = useState(0.5);
	useEffect(() => {
		setTimeout(() => {
			if (loadingTimmer > 0) setLoadingTimmer(loadingTimmer - 0.1);
		}, 100);
	}, [loadingTimmer]);

	// Filter
	const filter = useSelector(selectUserFilter);

	useEffect(() => {
		if (
			(isAdmin && filter.userGroup !== 'ADMIN') ||
			(!isAdmin && filter.userGroup !== 'CUSTOMER')
		) {
			dispatch(
				userActions.setFilter({
					...filter,
					userGroup: isAdmin ? 'ADMIN' : 'CUSTOMER'
				})
			);
		}
	}, [dispatch, filter, isAdmin]);

	const handleFilter = formValues => {
		if (loading || loadingTimmer > 0) return;

		const { key, status } = formValues;

		let newFilter = {
			...filter,
			key: key !== '' ? key : undefined,
			status: status !== '' ? status : undefined,
			_page: 1,
			_limit: filter._limit
		};

		dispatch(userActions.setFilter(newFilter));
	};

	const handleResetFilter = () => {
		if (loading || loadingTimmer > 0) return;

		dispatch(
			userActions.setFilter({
				...filter,
				key: undefined,
				status: undefined,
				_page: 1,
				_limit: filter._limit
			})
		);
	};

	// SelectedItems
	const selectedItems = useSelector(selectUserSelectedItems);

	const handleSelectItem = params => {
		if (params.all !== undefined) {
			const newSelectedItems = params.all
				? users.map(item => item._id)
				: [];

			dispatch(userActions.setSelectedItems(newSelectedItems));
		} else {
			const newSelectedItems = params.checked
				? [...selectedItems, params._id]
				: selectedItems.filter(item => item !== params._id);

			dispatch(userActions.setSelectedItems(newSelectedItems));
		}
	};

	// Fetch data
	const users = useSelector(selectUsers);
	useEffect(() => {
		setLoadingTimmer(0.5);
		dispatch(fetchUsers(filter));
		dispatch(userActions.setSelectedItems([]));
	}, [dispatch, filter]);

	// Modal
	const [showModal, setShowModal] = useState(false);
	const [updatedUser, setUpdatedUser] = useState({
		_id: null,
		username: '',
		password: '',
		name: '',
		gender: 'Nam',
		dateOfBirth: '',
		address: '',
		phone: '',
		email: '',
		status: true
	});

	const onShowModal = user => {
		const dateOfBirth = formatToVNDate(
			new Date(user?.dateOfBirth || '1990-1-1'),
			'yyyy-MM-dd'
		);

		setUpdatedUser({
			_id: user?._id || null,
			username: user?.username || '',
			password: '',
			userGroup: isAdmin ? 'ADMIN' : 'CUSTOMER',
			avatar: user?.avatar || '/images/no-avatar.png',
			name: user?.name || '',
			gender: user?.gender || 'Nam',
			dateOfBirth: dateOfBirth,
			address: user?.address || '',
			phone: user?.phone || '',
			email: user?.email || '',
			status: user?.status !== undefined ? user?.status : true
		});

		setShowModal(true);
	};

	const onCloseModal = () => setShowModal(false);

	// Update user
	const handleUpdateUser = async formValues => {
		try {
			const user = {
				_id: formValues._id || undefined,
				username: formValues.username,
				password:
					formValues.password === ''
						? undefined
						: formValues.password,
				userGroup: formValues.userGroup,
				avatar: formValues.avatar,
				name: formValues.name,
				gender: formValues.gender,
				dateOfBirth: formValues.dateOfBirth,
				address: formValues.address,
				phone: formValues.phone,
				email: formValues.email,
				status: formValues.status
			};

			const res = user._id
				? await userApi.update(user)
				: await userApi.add(user);

			if (res.status) {
				toast.success(res.message);
				setShowModal(false);

				if (user._id && !formValues.userGroup)
					dispatch(userActions.setUser(res.user));
				else dispatch(userActions.setFilter({ ...filter }));
			} else {
				toast.error(res.message);
			}
		} catch (error) {
			toast.error('Lỗi hệ thống!');
		}
	};

	const handleUpdateUserStatus = async user => {
		setConfirm({
			show: true,
			message: (
				<>
					Cập nhật trạng thái người dùng <b>{user.name}</b>?
				</>
			),
			onSuccess: async () => {
				try {
					const newUser = {
						_id: user._id,
						status: !user.status
					};

					const res = await userApi.update(newUser);

					if (res.status) {
						toast.success(
							<>
								Cập nhật trạng thái người dùng{' '}
								<b>{user.name}</b> thành công!
							</>
						);
						dispatch(userActions.setUser(res.user));
					} else {
						toast.error(
							<>
								Cập nhật trạng thái người dùng{' '}
								<b>{user.name}</b> không thành công!
							</>
						);
					}
				} catch (error) {
					toast.error(
						<>
							Lỗi hệ thống! Cập nhật trạng thái người dùng{' '}
							<b>{user.name}</b> không thành công!
						</>
					);
				}
			}
		});
	};

	// Remove user
	const handleRemoveUser = async user => {
		setConfirm({
			show: true,
			message: (
				<>
					Xóa người dùng <b>{user.name}</b> khỏi hệ thống?
				</>
			),
			onSuccess: async () => {
				try {
					const res = await userApi.remove(user._id);

					if (res.status) {
						toast.success(
							<>
								Xóa người dùng <b>{user.name} </b>
								thành công!
							</>
						);
						dispatch(userActions.setFilter({ ...filter }));
					} else {
						toast.error(
							<>
								Xóa người dùng <b>{user.name} </b>
								không thành công!
							</>
						);
					}
				} catch (error) {
					toast.error(
						<>
							Lỗi hệ thống! Xóa người dùng <b>{user.name}</b>{' '}
							không thành công!
						</>
					);
				}
			}
		});
	};

	const handleRemoveUserSelections = async () => {
		setConfirm({
			show: true,
			message: 'Xóa những người dùng đã chọn khỏi hệ thống?',
			onSuccess: async () => {
				const removeSuccess = new Promise(async (resolve, reject) => {
					for (let i = 0; i < selectedItems.length; i++) {
						try {
							const res = await userApi.remove(selectedItems[i]);

							if (res.status) {
								toast.success(
									<>
										Xóa người dùng <b>{res.user.name} </b>
										thành công!
									</>
								);
							} else {
								toast.error(
									<>
										Xóa người dùng <b>{res.user.name} </b>
										không thành công!
									</>
								);
							}

							if (i === selectedItems.length - 1) resolve(true);
						} catch (error) {
							toast.error(
								'Lỗi hệ thống! Xóa người dùng không thành công!'
							);
						}
					}
				});

				if (await removeSuccess)
					dispatch(userActions.setFilter({ ...filter }));
			}
		});
	};

	// Pagination
	const pagination = useSelector(selectUserPagination);

	const handlePageChange = _page => {
		if (_page !== pagination._page)
			dispatch(
				userActions.setFilter({
					...filter,
					_page,
					_limit: pagination._limit
				})
			);
	};

	// JSX
	const dataJSX = (
		<div className="table-responsive">
			<UserList
				selectedItems={selectedItems}
				users={users}
				onSelectItem={handleSelectItem}
				onShowModal={onShowModal}
				onUpdateUserStatus={handleUpdateUserStatus}
				onRemoveUser={handleRemoveUser}
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

	// Return
	return (
		<Card className="shadow mb-3">
			<Card.Header>
				<Card.Title as="h6" className="fw-bold my-1">
					{isAdmin ? 'Tài Khoản Quản Trị' : 'Tài Khoản Khách Hàng'}
				</Card.Title>
			</Card.Header>
			<Card.Body>
				<div>
					<SplitButton
						icon="fas fa-plus"
						text="Thêm mới"
						className="mb-3 me-2"
						onClick={() => onShowModal(null)}
					/>
					<SplitButton
						variant="danger"
						icon="fas fa-trash"
						disabled={selectedItems.length <= 0}
						text="Xóa"
						className="mb-3"
						onClick={handleRemoveUserSelections}
					/>
				</div>
				<UserFilter
					filter={filter}
					onFilter={handleFilter}
					onReset={handleResetFilter}
				/>
				<UserModal
					show={showModal}
					initialValues={updatedUser}
					onClose={onCloseModal}
					onSubmit={handleUpdateUser}
				/>

				{loading || loadingTimmer > 0
					? loadingJSX
					: users.length > 0
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

export default UserPage;
