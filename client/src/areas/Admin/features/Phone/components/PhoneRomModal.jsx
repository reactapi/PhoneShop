import { yupResolver } from '@hookform/resolvers/yup';
import { SplitButton } from 'components/Buttons/SplitButton';
import { InputField } from 'components/FormFields/InputField';
import { useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

export const PhoneRomModal = props => {
	const { show, onSubmit, onClose } = props;

	const validationSchema = yup.object().shape({
		name: yup.string().required('Vui lòng nhập dung lượng rom!')
	});

	const { control, reset, handleSubmit } = useForm({
		resolver: yupResolver(validationSchema),
		defaultValues: {
			name: ''
		}
	});

	const handleUpdateRom = formValues => {
		onSubmit(formValues.name);
	};

	useEffect(() => {
		reset({ name: '' });
	}, [reset, show]);

	return (
		<Modal show={show} onHide={onClose}>
			<form onSubmit={handleSubmit(handleUpdateRom)}>
				<Modal.Header closeButton>
					<Modal.Title className="fw-bold" as="h5">
						Thêm Mới Rom
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<InputField
						label="Dung lượng"
						control={control}
						name="name"
						placeholder="32GB"
					/>
				</Modal.Body>
				<Modal.Footer>
					<SplitButton
						icon="fas fa-fw fa-times"
						variant="secondary"
						text="Hủy"
						onClick={onClose}
					/>
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
