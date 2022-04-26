import { yupResolver } from '@hookform/resolvers/yup';
import { SplitButton } from 'components/Buttons';
import { FileManager } from 'components/FileManager';
import { InputField } from 'components/FormFields';
import { useEffect, useState } from 'react';
import { Form, FormCheck, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

export const BannerModal = props => {
	const { show, initialValues, onClose, onSubmit } = props;
	const validationSchema = yup.object().shape({
		title: yup.string().required('Vui lòng nhập tiêu đề!'),
		image: yup.string().required('Vui lòng chọn ảnh!'),
		order: yup.string().required('Vui lòng nhập thứ tự hiển thị!')
	});

	const { control, register, reset, setValue, getValues, handleSubmit } =
		useForm({
			resolver: yupResolver(validationSchema)
		});

	const title = initialValues._id ? 'Cập Nhật Thông Tin' : 'Thêm Mới';
	const [statusLabel, setStatusLabel] = useState('Hiển thị');
	useEffect(() => {
		reset(initialValues);
		setStatusLabel(initialValues.status ? 'Hiển thị' : 'Ẩn');
	}, [initialValues, reset]);

	// Image Manager
	const [showImageManager, setShowImageManager] = useState(false);

	const handleShowImageManager = () => setShowImageManager(true);
	const handleCloseImageManager = () => setShowImageManager(false);
	const handleSelectImage = url => {
		setShowImageManager(false);
		setValue('image', url);
	};

	return (
		<Modal show={show} onHide={onClose}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Modal.Header closeButton>
					<Modal.Title className="fw-bold" as="h5">
						{title}
					</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					<InputField
						control={control}
						name="title"
						label="Tiêu đề"
					/>

					<Form.Group className="mb-3">
						<Form.Label>Ảnh</Form.Label>
						<div className="text-center">
							<img
								src={getValues('image')}
								width={200}
								height={100}
								alt="Ảnh bìa quảng cáo"
								className="border rounded mb-3"
							/>
							<br />
							<SplitButton
								icon="fas fa-image"
								text="Chọn ảnh"
								onClick={handleShowImageManager}
							/>
						</div>
						<Form.Control {...register('image')} hidden />
						<FileManager
							show={showImageManager}
							onSelectFile={handleSelectImage}
							onClose={handleCloseImageManager}
						/>
					</Form.Group>

					<InputField control={control} name="url" label="Liên kết" />
					<InputField
						control={control}
						name="order"
						label="Thứ tự hiển thị"
						type="number"
					/>

					<FormCheck
						type="switch"
						id="status"
						name="status"
						label={statusLabel}
						{...register('status')}
						onChange={e =>
							setStatusLabel(e.target.checked ? 'Hiển thị' : 'Ẩn')
						}
					/>
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
						type="submit"
						size="sm"
						variant="primary"
						icon="fas fa-fw fa-check"
						text="Hoàn thành"
					/>
				</Modal.Footer>
			</form>
		</Modal>
	);
};
