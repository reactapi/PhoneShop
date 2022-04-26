import phoneApi from 'api/phoneApi';
import {
	fetchPhones,
	phoneActions,
	selectPhoneFilter,
	selectPhoneLoading,
	selectPhonePagination,
	selectPhones,
	selectPhoneSelectedItems
} from 'app/phoneSlice';
import { SplitButton } from 'components/Buttons/SplitButton';
import { Confirm, ITMPagination } from 'components/Common/';
import { useEffect, useState } from 'react';
import { Alert, Card, ProgressBar } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
	PhoneColorModal,
	PhoneFilter,
	PhoneList,
	PhoneModal,
	PhoneModelModal,
	PhoneRamModal,
	PhoneRomModal
} from './components';

const PhonePage = () => {
	// Confirm
	const [confirm, setConfirm] = useState({});

	const handleCloseConfirm = () => {
		setConfirm({ ...confirm, show: false });
	};

	// Filter
	const filter = useSelector(selectPhoneFilter);

	const handleFilter = formValues => {
		if (loading || loadingTimmer > 0) return;

		const { key, category, status } = formValues;

		let newFilter = {
			key: key !== '' ? key : undefined,
			category: category !== '' ? category : undefined,
			status: status !== '' ? status : undefined,
			_page: 1,
			_limit: filter._limit
		};

		dispatch(phoneActions.setFilter(newFilter));
	};

	const handleResetFilter = () => {
		if (loading || loadingTimmer > 0) return;

		dispatch(
			phoneActions.setFilter({
				key: undefined,
				category: undefined,
				status: undefined,
				_page: 1,
				_limit: filter._limit
			})
		);
	};

	// SelectedItems
	const selectedItems = useSelector(selectPhoneSelectedItems);

	const handleSelectItem = params => {
		if (params.all !== undefined) {
			const newSelectedItems = params.all
				? phones.map(item => item._id)
				: [];

			dispatch(phoneActions.setSelectedItems(newSelectedItems));
		} else {
			const newSelectedItems = params.checked
				? [...selectedItems, params._id]
				: selectedItems.filter(item => item !== params._id);

			dispatch(phoneActions.setSelectedItems(newSelectedItems));
		}
	};

	// Loading
	const loading = useSelector(selectPhoneLoading);
	const [loadingTimmer, setLoadingTimmer] = useState(0.5);
	useEffect(() => {
		setTimeout(() => {
			if (loadingTimmer > 0) setLoadingTimmer(loadingTimmer - 0.1);
		}, 100);
	}, [loadingTimmer]);

	// Fetch phones
	const dispatch = useDispatch();
	const phones = useSelector(selectPhones);

	useEffect(() => {
		dispatch(fetchPhones(filter));
		setLoadingTimmer(0.5);
		dispatch(phoneActions.setSelectedItems([]));
	}, [dispatch, filter]);

	// Modal
	const [showModal, setShowModal] = useState(false);
	const [showBackdrop, setShowBackdrop] = useState(false);
	const [updatedPhone, setUpdatedPhone] = useState({});

	const handleShowModal = phone => {
		setUpdatedPhone({ ...phone });
		setShowModal(true);
	};

	const handleCloseModal = () => {
		setShowModal(false);

		setConfirm({
			show: true,
			message: 'Bạn chưa lưu dữ liệu. Vẫn đóng cửa sổ?',
			onCancel: () => setShowModal(true)
		});
	};

	// Update phone
	const handleUpdatePhone = async phone => {
		try {
			const res = phone._id
				? await phoneApi.update(phone)
				: await phoneApi.add(phone);

			if (res.status) {
				toast.success(res.message);
				setShowModal(false);
				if (phone._id) dispatch(phoneActions.setPhone(res.phone));
				else dispatch(phoneActions.setFilter({ ...filter }));
			} else {
				toast.error(res.message);
			}
		} catch (error) {
			toast.error('Lỗi hệ thống!');
		}
	};

	const handleUpdatePhoneStatus = async phone => {
		setConfirm({
			show: true,
			message: (
				<>
					Cập nhật trạng thái hiển thị của điện thoại{' '}
					<b>{phone.name}</b>?
				</>
			),
			onSuccess: async () => {
				try {
					const newPhone = {
						_id: phone._id,
						status: !phone.status
					};

					const res = await phoneApi.update(newPhone);

					if (res.status) {
						toast.success(
							<>
								Cập nhật trạng thái hiển thị của điện thoại{' '}
								<b>{phone.name}</b> thành công!
							</>
						);
						dispatch(phoneActions.setPhone(res.phone));
					} else {
						toast.error(
							<>
								Cập nhật trạng thái hiển thị của điện thoại{' '}
								<b>{phone.name}</b> không thành công!
							</>
						);
					}
				} catch (error) {
					toast.error(
						<>
							Lỗi hệ thống! Cập nhật trạng thái hiển thị của điện
							thoại <b>{phone.name}</b> thành công!
						</>
					);
				}
			}
		});
	};

	// Remove phones
	const handleRemovePhone = async phone => {
		setConfirm({
			show: true,
			message: (
				<>
					Xóa điện thoại <b>{phone.name}</b> khỏi hệ thống?
				</>
			),
			onSuccess: async () => {
				try {
					const res = await phoneApi.remove(phone._id);

					if (res.status) {
						toast.success(
							<>
								Xóa điện thoại <b>{phone.name}</b> thành công!
							</>
						);
						dispatch(phoneActions.setFilter({ ...filter }));
					} else {
						toast.error(
							<>
								Xóa điện thoại <b>{phone.name}</b> không thành
								công!
							</>
						);
					}
				} catch (error) {
					toast.error(
						<>
							Lỗi hệ thống! Xóa điện thoại <b>{phone.name}</b>{' '}
							không thành công!
						</>
					);
				}
			}
		});
	};

	const handleRemovePhoneSelections = async () => {
		setConfirm({
			show: true,
			message: 'Xóa những điện thoại đã chọn khỏi hệ thống?',
			onSuccess: async () => {
				const removeSuccess = new Promise(async (resolve, reject) => {
					for (let i = 0; i < selectedItems.length; i++) {
						try {
							const res = await phoneApi.remove(selectedItems[i]);

							if (res.status) {
								toast.success(
									<>
										Xóa điện thoại <b>{res.phone.name} </b>
										thành công!
									</>
								);
							} else {
								toast.error(
									<>
										Xóa điện thoại <b>{res.phone.name}</b>
										không thành công!
									</>
								);
							}

							if (i === selectedItems.length - 1) resolve(true);
						} catch (error) {
							toast.error(
								'Lỗi hệ thống! Xóa điện thoại không thành công!'
							);
						}
					}
				});

				if (await removeSuccess)
					dispatch(phoneActions.setFilter({ ...filter }));
			}
		});
	};

	// Pagination
	const pagination = useSelector(selectPhonePagination);

	const handlePageChange = _page => {
		if (_page !== pagination._page)
			dispatch(
				phoneActions.setFilter({
					...filter,
					_page,
					_limit: pagination._limit
				})
			);
	};

	// Rom Modal
	const [showRomModal, setShowRomModal] = useState(false);

	const handleShowRomModal = () => {
		setShowRomModal(true);
		setShowBackdrop(true);
	};

	const handleCloseRomModal = () => {
		setShowRomModal(false);
		setShowBackdrop(false);
	};

	// Roms
	const [roms, setRoms] = useState([]);

	const sortAndUpdateRoms = newRoms => {
		newRoms.sort((x, y) => x.localeCompare(y));
		setRoms(newRoms);
	};

	const handleUpdateRom = newRom => {
		// Check for rom exists
		const index = roms.findIndex(rom => rom === newRom);

		if (index >= 0) {
			toast.error('Bản rom này đã tồn tại!');
			return;
		}

		// All good
		const newRoms = [...roms, newRom];

		sortAndUpdateRoms(newRoms);
		toast.success(
			<>
				Thêm mới rom <b>{newRom}</b> thành công!
			</>
		);
		handleCloseRomModal();
	};

	const handleRemoveRom = removedRom => {
		setShowBackdrop(true);

		setConfirm({
			show: true,
			title: 'Xóa Rom',
			message: (
				<>
					Xóa bản rom <b>{removedRom}</b> khỏi điện thoại?
					<br />
					<Alert variant="danger" className="mt-2 mb-0">
						Lưu ý: Xóa bản rom này có thể sẽ ảnh hưởng tới các phiên
						bản điện thoại liên quan!
					</Alert>
				</>
			),
			onSuccess: () => {
				const newRoms = roms.filter(rom => rom !== removedRom);
				const newModels = models.filter(
					model => model.rom !== removedRom
				);

				sortAndUpdateRoms(newRoms);
				sortAndUpdateModels(newModels);
				setShowBackdrop(false);
				toast.success(
					<>
						Xóa thành công bản rom <b>{removedRom}</b>!
					</>
				);
			},
			onClose: () => {
				handleCloseConfirm();
				setShowBackdrop(false);
			}
		});
	};

	// Rom options
	const [romOptions, setRomOptions] = useState([
		{ value: '', label: 'Chọn rom' }
	]);

	useEffect(() => {
		const handleUpdateRomOptions = () => {
			const newRomOptions =
				roms.length > 0
					? roms.map(rom => ({ value: rom, label: rom }))
					: [];

			newRomOptions.unshift({ value: '', label: 'Chọn rom' });
			setRomOptions(newRomOptions);
		};

		handleUpdateRomOptions();
	}, [roms]);

	// Ram Modal
	const [showRamModal, setShowRamModal] = useState(false);

	const handleShowRamModal = () => {
		setShowRamModal(true);
		setShowBackdrop(true);
	};

	const handleCloseRamModal = () => {
		setShowRamModal(false);
		setShowBackdrop(false);
	};

	// Rams
	const [rams, setRams] = useState([]);

	const sortAndUpdateRams = newRams => {
		newRams.sort((x, y) => x.localeCompare(y));
		setRams(newRams);
	};

	const handleUpdateRam = newRam => {
		// Check for ram exists
		const index = rams.findIndex(ram => ram === newRam);

		if (index >= 0) {
			toast.error('Bản ram này đã tồn tại!');
			return;
		}

		// All good
		const newRams = [...rams, newRam];

		sortAndUpdateRams(newRams);
		toast.success(
			<>
				Thêm mới ram <b>{newRam}</b> thành công!
			</>
		);
		handleCloseRamModal();
	};

	const handleRemoveRam = removedRam => {
		setShowBackdrop(true);

		setConfirm({
			show: true,
			title: 'Xóa Ram',
			message: (
				<>
					Xóa bản ram <b>{removedRam}</b> khỏi điện thoại?
					<br />
					<Alert className="mt-2 mb-0" variant="danger">
						Lưu ý: Xóa bản ram này có thể sẽ ảnh hưởng tới các phiên
						bản điện thoại liên quan!
					</Alert>
				</>
			),
			onSuccess: () => {
				const newRams = rams.filter(ram => ram !== removedRam);
				const newModels = models.filter(
					model => model.ram !== removedRam
				);

				sortAndUpdateRams(newRams);
				sortAndUpdateModels(newModels);
				setShowRamModal(false);
				setShowBackdrop(false);
				toast.success(
					<>
						Xóa thành công bản ram <b>{removedRam}</b>!
					</>
				);
			},
			onClose: () => {
				handleCloseConfirm();
				setShowBackdrop(false);
			}
		});
	};

	// Ram options
	const [ramOptions, setRamOptions] = useState([
		{ value: '', label: 'Chọn ram' }
	]);

	useEffect(() => {
		const handleUpdateRamOptions = () => {
			const newRamOptions =
				rams.length > 0
					? rams.map(ram => ({ value: ram, label: ram }))
					: [];

			newRamOptions.unshift({ value: '', label: 'Chọn ram' });
			setRamOptions(newRamOptions);
		};

		handleUpdateRamOptions();
	}, [rams]);

	// Color Modal
	const [showColorModal, setShowColorModal] = useState(false);

	const handleShowColorModal = () => {
		setShowColorModal(true);
		setShowBackdrop(true);
	};

	const handleCloseColorModal = () => {
		setShowColorModal(false);
		setShowBackdrop(false);
	};

	// Colors
	const [colors, setColors] = useState([]);

	const sortAndUpdateColors = newColors => {
		newColors.sort((x, y) => x.localeCompare(y));
		setColors(newColors);
	};

	const handleUpdateColor = newColor => {
		// Check for color exists
		const index = colors.findIndex(color => color === newColor);

		if (index >= 0) {
			toast.error('Màu này đã tồn tại!');
			return;
		}

		// All good
		const newColors = [...colors, newColor];

		sortAndUpdateColors(newColors);
		toast.success(
			<>
				Thêm mới màu <b>{newColor}</b> thành công!
			</>
		);
		handleCloseColorModal();
	};

	const handleRemoveColor = removedColor => {
		setShowBackdrop(true);

		setConfirm({
			show: true,
			title: 'Xóa Màu',
			message: (
				<>
					Xóa màu <b>{removedColor}</b> khỏi điện thoại?
					<Alert className="mt-2 mb-0" variant="danger">
						Lưu ý: Xóa bản màu này có thể sẽ ảnh hưởng tới các phiên
						bản điện thoại và hình ảnh liên quan!
					</Alert>
				</>
			),
			onSuccess: () => {
				const newColors = colors.filter(
					color => color !== removedColor
				);
				const newModels = models.filter(
					model => model.color !== removedColor
				);
				const newPhotos = photos.filter(
					photo => photo.title !== removedColor
				);

				sortAndUpdateColors(newColors);
				sortAndUpdateModels(newModels);
				sortAndUpdatePhotos(newPhotos);
				setShowBackdrop(false);
				toast.success(
					<>
						Xóa thành công màu <b>{removedColor}</b>!
					</>
				);
			},
			onClose: () => {
				handleCloseConfirm();
				setShowBackdrop(false);
			}
		});
	};

	// Color options
	const [colorOptions, setColorOptions] = useState([
		{ value: '', label: 'Chọn màu' }
	]);

	useEffect(() => {
		const handleUpdateColorOptions = () => {
			const newColorOptions =
				colors.length > 0
					? colors.map(color => ({ value: color, label: color }))
					: [];

			newColorOptions.unshift({ value: '', label: 'Chọn màu' });
			setColorOptions(newColorOptions);
		};

		handleUpdateColorOptions();
	}, [colors]);

	// ModelModal
	const [showModelModal, setShowModelModal] = useState(false);
	const [updatedModel, setUpdatedModel] = useState({});

	const handleShowModelModal = model => {
		setShowModelModal(true);
		setShowBackdrop(true);
		setUpdatedModel({ ...model });
	};

	const handleCloseModelModal = () => {
		setShowModelModal(false);
		setShowBackdrop(false);
	};

	// Models
	const [models, setModels] = useState([]);

	const sortAndUpdateModels = newModels => {
		newModels = [...newModels].sort((x, y) =>
			(x.rom + x.ram + x.color).localeCompare(y.rom + y.ram + y.color)
		);

		setModels(newModels);
	};

	const handleUpdateModel = (newModel, isUpdate) => {
		let newModels;

		if (isUpdate) {
			newModels = [...models];
			const index = newModels.findIndex(
				model =>
					`${model.rom}${model.ram}${model.color}` ===
					`${newModel.rom}${newModel.ram}${newModel.color}`
			);
			newModels[index] = newModel;

			toast.success(
				<>
					Cập nhật phiên bản điên thoại{' '}
					<b>
						{newModel.rom} / {newModel.ram} / {newModel.color}
					</b>{' '}
					thành công!
				</>
			);
		} else {
			const index = models.findIndex(
				model =>
					`${model.rom}${model.ram}${model.color}` ===
					`${newModel.rom}${newModel.ram}${newModel.color}`
			);

			if (index >= 0) {
				toast.error(
					<>
						Phiên bản điên thoại{' '}
						<b>
							{newModel.rom} / {newModel.ram} / {newModel.color}
						</b>{' '}
						đã tồn tại!
					</>
				);
				return;
			}

			newModels = [...models, newModel];
			toast.success(
				<>
					Thêm mới phiên bản điên thoại{' '}
					<b>
						{newModel.rom} / {newModel.ram} / {newModel.color}
					</b>{' '}
					thành công!
				</>
			);
		}

		sortAndUpdateModels(newModels);
		handleCloseModelModal();
	};

	const handleRemoveModel = deletedModel => {
		setShowBackdrop(true);

		setConfirm({
			show: true,
			title: 'Xóa Phiên Bản',
			message: (
				<>
					Xóa phiên bản{' '}
					<b>
						{deletedModel.rom} / {deletedModel.ram} /{' '}
						{deletedModel.color}
					</b>
					?
				</>
			),
			onSuccess: () => {
				let newModels = models.filter(
					model =>
						`${model.rom}${model.ram}${model.color}` !==
						`${deletedModel.rom}${deletedModel.ram}${deletedModel.color}`
				);

				sortAndUpdateModels(newModels);
				toast.success(
					<>
						Xóa phiên bản điện thoại{' '}
						<b>
							{deletedModel.rom} / {deletedModel.ram} /{' '}
							{deletedModel.color}
						</b>{' '}
						thành công!
					</>
				);
				setShowBackdrop(false);
			},
			onClose: () => {
				handleCloseConfirm();
				setShowBackdrop(false);
			}
		});
	};

	// Photos
	const [photos, setPhotos] = useState([]);

	const sortAndUpdatePhotos = newPhotos => {
		newPhotos = [...newPhotos].sort((x, y) =>
			x.title.localeCompare(y.title)
		);
		setPhotos(newPhotos);
	};

	const handleRemovePhoto = deletedPhoto => {
		setShowBackdrop(true);

		setConfirm({
			show: true,
			title: 'Xóa Hình Ảnh',
			message: `Xóa hình ảnh này khỏi điện thoại?`,
			onSuccess: () => {
				const newPhotos = [...photos];

				const index = newPhotos.findIndex(
					photo => photo.url === deletedPhoto.url
				);
				newPhotos.splice(index, 1);
				sortAndUpdatePhotos(newPhotos);
				toast.success('Xóa hình ảnh khỏi điện thoại thành công!');
				setShowBackdrop(false);
			},
			onClose: () => {
				handleCloseConfirm();
				setShowBackdrop(false);
			}
		});
	};

	// Show list
	const dataJSX = (
		<div>
			<PhoneList
				selectedItems={selectedItems}
				phones={phones}
				onSelectItem={handleSelectItem}
				onShowModal={handleShowModal}
				onUpdatePhoneStatus={handleUpdatePhoneStatus}
				onRemovePhone={handleRemovePhone}
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
		<Card className="shadow mb-4">
			<Card.Header className="fw-bold">Điện Thoại</Card.Header>
			<Card.Body>
				<div>
					<SplitButton
						icon="fas fa-fw fa-plus"
						text="Thêm mới"
						className="mb-3 me-2"
						onClick={handleShowModal}
					/>
					<SplitButton
						disabled={selectedItems.length <= 0}
						variant="danger"
						icon="fas fa-fw fa-trash"
						text="Xóa"
						className="mb-3"
						onClick={handleRemovePhoneSelections}
					/>
				</div>
				<PhoneFilter
					filter={filter}
					onFilter={handleFilter}
					onReset={handleResetFilter}
				/>
				<PhoneModal
					show={showModal}
					showBackdrop={showBackdrop}
					initialValues={updatedPhone}
					setShow={setShowModal}
					onSubmit={handleUpdatePhone}
					onClose={handleCloseModal}
					// Roms
					roms={roms}
					setRoms={setRoms}
					handleShowRomModal={handleShowRomModal}
					handleRemoveRom={handleRemoveRom}
					// Rams
					rams={rams}
					setRams={setRams}
					handleShowRamModal={handleShowRamModal}
					handleRemoveRam={handleRemoveRam}
					// Colors
					colors={colors}
					setColors={setColors}
					handleShowColorModal={handleShowColorModal}
					handleRemoveColor={handleRemoveColor}
					// Models
					models={models}
					setModels={setModels}
					handleShowModelModal={handleShowModelModal}
					handleRemoveModel={handleRemoveModel}
					// Photos
					photos={photos}
					setPhotos={setPhotos}
					handleRemovePhoto={handleRemovePhoto}
				/>

				{/* Modal */}
				<PhoneRomModal
					show={showRomModal}
					onSubmit={handleUpdateRom}
					onClose={handleCloseRomModal}
				/>
				<PhoneRamModal
					show={showRamModal}
					onSubmit={handleUpdateRam}
					onClose={handleCloseRamModal}
				/>
				<PhoneColorModal
					show={showColorModal}
					onSubmit={handleUpdateColor}
					onClose={handleCloseColorModal}
				/>
				<PhoneModelModal
					show={showModelModal}
					model={updatedModel}
					romOptions={romOptions}
					ramOptions={ramOptions}
					colorOptions={colorOptions}
					onSubmit={handleUpdateModel}
					onClose={handleCloseModelModal}
				/>

				{loading || loadingTimmer > 0
					? loadingJSX
					: phones.length > 0
					? dataJSX
					: noDataJSX}

				<Confirm
					show={confirm.show}
					title={confirm.title}
					message={confirm.message}
					onClose={confirm.onClose || handleCloseConfirm}
					onCancel={confirm.onCancel}
					onSuccess={confirm.onSuccess}
				/>
			</Card.Body>
		</Card>
	);
};

export default PhonePage;
