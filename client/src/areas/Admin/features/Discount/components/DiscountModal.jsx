import { yupResolver } from '@hookform/resolvers/yup';
import { SplitButton } from 'components/Buttons';
import { InputField } from 'components/FormFields';
import { useEffect, useState } from 'react';
import { FormCheck, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

export const DiscountModal = props => {
	const { show, initialValues, onClose, onSubmit } = props;
	const validationSchema = yup.object().shape({
		code: yup.string().required('Vui lòng nhập mã phiếu giảm giá!'),
		name: yup.string().required('Vui lòng nhập tên phiếu giảm giá!'),
		quantity: yup
			.number()
			.required('Vui lòng nhập số lượng phiếu giảm giá!')
			.typeError('Vui lòng nhập số lượng phiếu giảm giá!')
			.min(0, 'Số lượng tối thiểu là 0!'),
		price: yup
			.number()
			.required('Vui lòng nhập giá giảm!')
			.typeError('Vui lòng nhập giá giảm!')
			.min(0, 'Giá giảm tối thiểu là 0!'),
		status: yup.boolean().required('Vui lòng chọn trạng thái phiếu giảm giá!')
	});

	const { control, register, reset, handleSubmit } = useForm({
		resolver: yupResolver(validationSchema)
	});

	const title = initialValues._id ? 'Cập Nhật Thông Tin' : 'Thêm Mới';
	const [statusLabel, setStatusLabel] = useState('Kích hoạt');
	useEffect(() => {
		reset(initialValues);
		setStatusLabel(initialValues.status ? 'Kích hoạt' : 'Khóa');
	}, [initialValues, reset]);

	return (
		<Modal show={show} onHide={onClose}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Modal.Header closeButton>
					<Modal.Title className="fw-bold" as="h5">
						{title}
					</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					<InputField control={control} name="code" label="Mã giảm giá" />
					<InputField control={control} name="name" label="Tên phiếu giảm giá" />
					<InputField control={control} name="quantity" label="Số lượng" />
					<InputField control={control} name="price" label="Giảm (đ)" />

					<FormCheck
						type="switch"
						id="status"
						name="status"
						label={statusLabel}
						{...register('status')}
						onChange={e => setStatusLabel(e.target.checked ? 'Kích hoạt' : 'Khóa')}
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
