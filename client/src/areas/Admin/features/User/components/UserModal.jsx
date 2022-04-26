import { yupResolver } from '@hookform/resolvers/yup';
import { SplitButton } from 'components/Buttons';
import { FileManager } from 'components/FileManager';
import { InputField } from 'components/FormFields';
import { SelectField } from 'components/FormFields/SelectField';
import { useEffect, useState } from 'react';
import { Col, FormCheck, Modal, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { formatToVNDate } from 'utils';
import * as yup from 'yup';

export const UserModal = props => {
	const { show, initialValues, onClose, onSubmit } = props;

	const validationSchema = yup.object().shape({
		username: yup.string().required('Vui lòng nhập tên tài khoản!'),
		password: initialValues?._id
			? yup.string()
			: yup.string().required('Vui lòng nhập mật khẩu!'),
		userGroup: yup.string().required('Vui lòng chọn nhóm tài khoản!'),
		name: yup.string().required('Vui lòng nhập tên người dùng!'),
		gender: yup.string().required('Vui lòng chọn giới tính!'),
		dateOfBirth: yup
			.date()
			.required('Vui lòng nhập ngày sinh!')
			.typeError('Vui lòng nhập ngày sinh!')
			.min('1920-1-1', 'Ngày sinh phải sau ngày 01-01-1920!')
			.max(
				formatToVNDate(new Date(), 'yyyy-MM-dd'),
				`Ngày sinh phải trước ngày ${formatToVNDate(
					new Date(),
					'yyyy-MM-dd'
				)}!`
			),
		address: yup.string().required('Vui lòng nhập địa chỉ!'),
		phone: yup.string().required('Vui lòng nhập số điện thoại!'),
		email: yup.string().required('Vui lòng nhập email!'),
		status: yup.boolean().required('Vui lòng chọn trạng thái tài khoản!')
	});

	const { control, register, reset, setValue, getValues, handleSubmit } =
		useForm({
			resolver: yupResolver(validationSchema)
		});

	const title = initialValues._id ? 'Cập Nhật Thông Tin' : 'Thêm Mới';
	const [statusLabel, setStatusLabel] = useState('Hiển thị');
	useEffect(() => {
		reset(initialValues);
		setStatusLabel(initialValues.status ? 'Kích hoạt' : 'Khóa');
	}, [initialValues, reset]);

	const genderOptions = [
		{ label: 'Nam', value: 'Nam' },
		{ label: 'Nữ', value: 'Nữ' }
	];

	const userGroupOptions = [
		{ label: 'Quản trị viên', value: 'ADMIN' },
		{ label: 'Khách hàng', value: 'CUSTOMER' }
	];

	// Img manager
	const [showImageManager, setShowImageManager] = useState(false);

	const handleShowImageManager = () => setShowImageManager(true);

	const handleCloseImageManager = () => setShowImageManager(false);

	const handleSelectAvatar = file => {
		setValue('avatar', file);
		setShowImageManager(false);
	};

	// Return
	return (
		<Modal size="lg" show={show} onHide={onClose}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Modal.Header closeButton>
					<Modal.Title className="fw-bold" as="h5">
						{title}
					</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					<Row className="g-4">
						<Col xl={4} className="text-center">
							<div className="mb-3">
								<img
									src={getValues('avatar')}
									width={200}
									height={200}
									className="rounded-circle border"
									alt="Ảnh đại diện"
								/>
								<input {...register('avatar')} hidden />
							</div>
							<SplitButton
								icon="fas fa-fw fa-image"
								text="Chọn ảnh"
								onClick={handleShowImageManager}
							/>

							<FileManager
								show={showImageManager}
								onSelectFile={handleSelectAvatar}
								onClose={handleCloseImageManager}
							/>
						</Col>
						<Col>
							<InputField
								control={control}
								name="username"
								label="Tài khoản"
							/>
							<InputField
								control={control}
								name="password"
								label="Mật khẩu"
							/>
							{initialValues?._id && (
								<SelectField
									control={control}
									name="userGroup"
									label="Nhóm tài khoản"
									options={userGroupOptions}
								/>
							)}
							<InputField
								control={control}
								name="name"
								label="Họ và tên"
							/>
							<SelectField
								control={control}
								name="gender"
								label="Giới tính"
								options={genderOptions}
							/>
							<InputField
								control={control}
								type="date"
								name="dateOfBirth"
								label="Ngày sinh"
							/>
							<InputField
								control={control}
								name="address"
								label="Địa chỉ"
							/>
							<InputField
								control={control}
								name="phone"
								label="Số điện thoại"
							/>
							<InputField
								control={control}
								name="email"
								label="Email"
							/>
							<FormCheck
								type="switch"
								id="status"
								name="status"
								label={statusLabel}
								{...register('status')}
								onChange={e =>
									setStatusLabel(
										e.target.checked ? 'Kích hoạt' : 'Khóa'
									)
								}
							/>
						</Col>
					</Row>
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
