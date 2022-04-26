import { yupResolver } from '@hookform/resolvers/yup';
import { SplitButton } from 'components/Buttons/SplitButton';
import { InputField } from 'components/FormFields/InputField';
import { useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

export const PhoneColorModal = props => {
	const { show, onSubmit, onClose } = props;

	const validationSchema = yup.object().shape({
		color: yup.string().required('Vui lòng nhập màu!')
	});

	const { control, reset, handleSubmit } = useForm({
		resolver: yupResolver(validationSchema),
		defaultValues: {
			color: ''
		}
	});

	const handleUpdateColor = formValues => {
		onSubmit(formValues.color);
	};

	useEffect(() => {
		reset({ color: '' });
	}, [reset, show]);

	return (
		<Modal show={show} onHide={onClose}>
			<form onSubmit={handleSubmit(handleUpdateColor)}>
				<Modal.Header closeButton>
					<Modal.Title className="fw-bold" as="h5">
						Thêm Mới Màu
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<InputField label="Màu" control={control} name="color" placeholder="Đỏ" />
				</Modal.Body>
				<Modal.Footer>
					<SplitButton icon="fas fa-fw fa-times" variant="secondary" text="Hủy" onClick={onClose} />
					<SplitButton
						icon="fas fa-fw fa-check"
						variant="primary"
						type="submit"
						text="Hoàn thành"
					/>
				</Modal.Footer>
			</form>
		</Modal>
	);
};
