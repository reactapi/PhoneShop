import { yupResolver } from '@hookform/resolvers/yup';
import { SplitButton } from 'components/Buttons';
import { InputField, SelectField } from 'components/FormFields';
import { useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

export const PhoneModelModal = props => {
	const { show, model, romOptions, ramOptions, colorOptions, onSubmit, onClose } = props;
	const isUpdate = Boolean(Object.values(model).length > 0 ? true : false);
	const title = isUpdate ? 'Cập Nhật Phiên Bản' : 'Thêm Mới Phiên Bản';

	// Validation
	const validationSchema = yup.object().shape({
		rom: yup.string().required('Vui lòng nhập rom!'),
		ram: yup.string().required('Vui lòng nhập ram!'),
		color: yup.string().required('Vui lòng nhập màu!'),
		quantity: yup
			.number()
			.typeError('Vui lòng nhập số lượng!')
			.required('Vui lòng nhập số lượng!')
			.min(0, 'Số lượng tối thiểu là 0!'),
		price: yup
			.number()
			.typeError('Vui lòng nhập giá tiền!')
			.required('Vui lòng nhập giá!')
			.min(0, 'Giá tối thiểu là 0đ!')
	});

	const { control, reset, handleSubmit } = useForm({
		resolver: yupResolver(validationSchema)
	});

	useEffect(() => {
		reset({
			rom: model.rom || '',
			ram: model.ram || '',
			color: model.color || '',
			quantity: model.quantity || 0,
			price: model.price || 0
		});
	}, [reset, model]);

	return (
		<Modal show={show} onHide={onClose}>
			<form onSubmit={handleSubmit(formValues => onSubmit(formValues, isUpdate))}>
				<Modal.Header closeButton>
					<Modal.Title className="fw-bold" as="h5">
						{title}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<SelectField
						control={control}
						name="rom"
						label="Rom"
						placeholder="32GB"
						isDisabled={isUpdate}
						options={romOptions}
					/>
					<SelectField
						control={control}
						name="ram"
						label="Ram"
						placeholder="1GB"
						isDisabled={isUpdate}
						options={ramOptions}
					/>
					<SelectField
						control={control}
						name="color"
						label="Màu"
						placeholder="Đen"
						isDisabled={isUpdate}
						options={colorOptions}
					/>
					<InputField
						control={control}
						name="quantity"
						label="Số lượng"
						placeholder="1"
						type="number"
					/>
					<InputField
						control={control}
						name="price"
						label="Giá"
						placeholder="1000000"
						type="number"
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
						size="sm"
						variant="primary"
						icon="fas fa-fw fa-check"
						text="Hoàn thành"
						type="submit"
					/>
				</Modal.Footer>
			</form>
		</Modal>
	);
};
