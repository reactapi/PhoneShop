import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import '@ckeditor/ckeditor5-build-classic/build/translations/vi';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { yupResolver } from '@hookform/resolvers/yup';
import categoryApi from 'api/categoryApi';
import { SplitButton } from 'components/Buttons';
import { FileManager } from 'components/FileManager';
import { InputField, SelectField } from 'components/FormFields';
import { useEffect, useState } from 'react';
import {
	Col,
	FormCheck,
	FormGroup,
	FormLabel,
	Modal,
	Row
} from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { formatToVND } from 'utils';
import * as yup from 'yup';
import {
	PhoneColorList,
	PhoneModelList,
	PhonePhotoList,
	PhoneRamList,
	PhoneRomList
} from './';

export const PhoneModal = props => {
	// Phone modal
	const {
		show,
		initialValues,
		showBackdrop,

		onClose,
		onSubmit
	} = props;

	const validationSchema = yup.object().shape({
		name: yup.string().required('Vui lòng nhập tên điện thoại!'),
		category: yup.string().required('Vui lòng chọn danh mục!')
	});

	const { control, register, setValue, reset, handleSubmit } = useForm({
		resolver: yupResolver(validationSchema)
	});

	const [description, setDescription] = useState('');

	const title = initialValues?._id ? 'Cập Nhật Thông Tin' : 'Thêm Mới';
	const [statusLabel, setStatusLabel] = useState('Hiển thị');

	// Fetch parent options
	const [categoryOptions, setCategoryOptions] = useState([
		{ value: '', label: 'Chọn danh mục' }
	]);
	useEffect(() => {
		const fetchCategories = async () => {
			const res = await categoryApi.fetchList({});

			if (res.status) {
				let categories = res.data;

				let newCategoryOptions = [
					{ value: '', label: 'Chọn danh mục' },
					...categories
						.filter(category => category._id !== initialValues._id)
						.map(category => ({
							value: category._id,
							label: category.name
						}))
				];

				setCategoryOptions(newCategoryOptions);
			}
		};

		fetchCategories();
	}, [initialValues]);

	const [promotionPrice, setPromotionPrice] = useState(0);

	// Update
	const onUpdate = formValues => {
		if (roms.length <= 0) {
			toast.error('Vui lòng thêm ít nhất 1 bản rom!');
			return;
		}

		if (rams.length <= 0) {
			toast.error('Vui lòng thêm ít nhất 1 bản ram!');
			return;
		}

		if (colors.length <= 0) {
			toast.error('Vui lòng thêm ít nhất 1 màu!');
			return;
		}

		if (models.length <= 0) {
			toast.error('Vui lòng thêm ít nhất 1 phiên bản điện thoại!');
			return;
		}

		if (photos.length <= 0) {
			toast.error('Vui lòng thêm ít nhất 1 hình ảnh mô tả!');
			return;
		}

		// All good
		const newCategory = {
			_id: formValues._id || undefined,
			name: formValues.name,
			category: formValues.category,
			rams,
			roms,
			colors,
			models,
			photos,
			promotionPrice: formValues.promotionPrice,
			description: description,
			status: formValues.status
		};

		onSubmit(newCategory);
	};

	// Roms
	const {
		roms,

		setRoms,
		handleShowRomModal,
		handleRemoveRom
	} = props;

	useEffect(() => {
		const handleUpdateRoms = newRoms => {
			newRoms = [...newRoms].sort((x, y) => x.localeCompare(y));

			setRoms(newRoms);
		};

		handleUpdateRoms(initialValues?.roms || []);
	}, [initialValues, setRoms]);

	// Rams
	const {
		rams,

		setRams,
		handleShowRamModal,
		handleRemoveRam
	} = props;

	useEffect(() => {
		const handleUpdateRams = newRams => {
			newRams = [...newRams].sort((x, y) => x.localeCompare(y));

			setRams(newRams);
		};

		handleUpdateRams(initialValues?.rams || []);
	}, [initialValues, setRams]);

	// Colors
	const {
		colors,

		setColors,
		handleShowColorModal,
		handleRemoveColor
	} = props;

	useEffect(() => {
		const handleUpdateColors = newColors => {
			newColors = [...newColors].sort((x, y) => x.localeCompare(y));

			setColors(newColors);
		};

		handleUpdateColors(initialValues?.colors || []);
	}, [initialValues, setColors]);

	// Models
	const {
		models,

		setModels,
		handleShowModelModal,
		handleRemoveModel
	} = props;

	useEffect(() => {
		const handleUpdateModels = newModels => {
			newModels = [...newModels].sort((x, y) =>
				(x.rom + x.ram + x.color).localeCompare(y.rom + y.ram + y.color)
			);

			setModels(newModels);
		};

		handleUpdateModels(initialValues?.models || []);
	}, [initialValues, setModels]);

	// Photos
	const {
		photos,

		setPhotos,
		handleRemovePhoto
	} = props;

	useEffect(() => {
		const handleUpdatePhotos = newPhotos => {
			newPhotos = [...newPhotos].sort((x, y) =>
				x.title.localeCompare(y.title)
			);

			setPhotos(newPhotos);
		};

		handleUpdatePhotos(initialValues?.photos || []);
	}, [initialValues, setPhotos]);

	// Effect
	useEffect(() => {
		reset({
			_id: initialValues?._id || null,
			name: initialValues?.name || '',
			category: initialValues?.category?._id || '',
			promotionPrice: initialValues?.promotionPrice || 0,
			status: initialValues?.status ? true : false
		});
		setPromotionPrice(initialValues?.promotionPrice || 0);
		setStatusLabel(initialValues?.status === true ? 'Hiển thị' : 'Ẩn');
		setDescription(initialValues?.description || '');
	}, [initialValues, reset]);

	// Image Manager
	const [showImageManager, setShowImageManager] = useState(false);
	const [updatedPhoto, setUdpatedPhoto] = useState({});

	const handleShowImageManager = photo => {
		setShowImageManager(true);
		setUdpatedPhoto(photo);
	};
	const handleCloseImageManager = () => setShowImageManager(false);
	const handleSelectImage = url => {
		let newPhotos = [...photos];

		if (updatedPhoto.url) {
			const index = newPhotos.findIndex(x => x.url === updatedPhoto.url);
			newPhotos[index] = { ...updatedPhoto, url };
		} else {
			newPhotos.push({ ...updatedPhoto, url });
		}

		setPhotos(newPhotos);
		setShowImageManager(false);
	};

	// Return
	return (
		<Modal size="xl" show={show} onHide={onClose}>
			<div
				style={{
					background: 'black',
					opacity: '70%',
					position: 'absolute',
					width: '100%',
					height: '100%',
					zIndex: 3
				}}
				hidden={!showBackdrop}
			/>
			<form onSubmit={handleSubmit(onUpdate)}>
				<Modal.Header closeButton>
					<Modal.Title className="fw-bold" as="h5">
						{title}
					</Modal.Title>
				</Modal.Header>

				<Modal.Body
					style={{
						maxHeight: 450,
						overflowX: 'hidden',
						overflowY: 'scroll'
					}}
				>
					<Row>
						<Col lg={6}>
							<InputField
								control={control}
								name="name"
								label="Tên điện thoại"
							/>
						</Col>
						<Col lg={4}>
							<SelectField
								control={control}
								name="category"
								label="Danh mục"
								placeholder="Chọn danh mục"
								options={categoryOptions}
							/>
						</Col>
						<Col lg={2}>
							<FormGroup className="mb-4">
								<FormLabel>Trạng thái</FormLabel>
								<FormCheck
									type="switch"
									className="mt-2"
									id="status"
									name="status"
									label={statusLabel}
									{...register('status')}
									onChange={e =>
										setStatusLabel(
											e.target.checked ? 'Hiển thị' : 'Ẩn'
										)
									}
								/>
							</FormGroup>
						</Col>
					</Row>

					<Row className="mb-3">
						<Col>
							<PhoneRomList
								roms={roms}
								handleShowRomModal={handleShowRomModal}
								handleRemoveRom={handleRemoveRom}
							/>
						</Col>
						<Col>
							<PhoneRamList
								rams={rams}
								handleShowRamModal={handleShowRamModal}
								handleRemoveRam={handleRemoveRam}
							/>
						</Col>
						<Col>
							<PhoneColorList
								colors={colors}
								handleShowColorModal={handleShowColorModal}
								handleRemoveColor={handleRemoveColor}
							/>
						</Col>
					</Row>

					<PhoneModelList
						models={models}
						handleShowModelModal={handleShowModelModal}
						handleRemoveModel={handleRemoveModel}
					/>

					<FileManager
						show={showImageManager}
						onSelectFile={handleSelectImage}
						onClose={handleCloseImageManager}
					/>
					<PhonePhotoList
						photos={photos}
						colors={colors}
						handleShowPhotoModal={handleShowImageManager}
						handleRemovePhoto={handleRemovePhoto}
					/>

					<InputField
						control={control}
						name="promotionPrice"
						label={`Giá khuyến mãi (Giảm ${formatToVND(
							promotionPrice
						)})`}
						type="number"
						placeholder="0"
						onChange={e => {
							setPromotionPrice(parseInt(e.target.value || 0));
							setValue('promotionPrice', e.target.value);
						}}
					/>

					<FormGroup>
						<FormLabel>Mô tả</FormLabel>

						<CKEditor
							editor={ClassicEditor}
							config={{
								language: 'vi',
								ckfinder: {
									uploadUrl:
										process.env.REACT_APP_API_URL +
										'/uploads/images'
								}
							}}
							data={description}
							onReady={editor => editor.setData(description)}
							onChange={(e, editor) =>
								setDescription(editor.getData())
							}
						/>
					</FormGroup>
				</Modal.Body>

				<Modal.Footer>
					<SplitButton
						size="sm"
						variant="secondary"
						icon="fas fa-fw fa-times"
						text="Hủy"
						onClick={onClose}
					/>
					<SplitButton
						size="sm"
						type="submit"
						variant="primary"
						icon="fas fa-fw fa-check"
						text="Hoàn thành"
					/>
				</Modal.Footer>
			</form>
		</Modal>
	);
};
