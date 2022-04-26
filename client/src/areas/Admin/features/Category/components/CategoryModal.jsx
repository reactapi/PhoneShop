import { yupResolver } from '@hookform/resolvers/yup';
import categoryApi from 'api/categoryApi';
import { SplitButton } from 'components/Buttons';
import { InputField } from 'components/FormFields';
import { SelectField } from 'components/FormFields/SelectField';
import { useEffect, useState } from 'react';
import { FormCheck, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

export const CategoryModal = props => {
	const { show, initialValues, onClose, onSubmit } = props;
	const validationSchema = yup.object().shape({
		name: yup.string().required('Vui lòng nhập tên danh mục!')
	});

	const { control, register, reset, handleSubmit } = useForm({
		resolver: yupResolver(validationSchema)
	});

	const title = initialValues._id ? 'Cập Nhật Thông Tin' : 'Thêm Mới';
	const [statusLabel, setStatusLabel] = useState('Hiển thị');
	useEffect(() => {
		reset(initialValues);
		setStatusLabel(initialValues.status ? 'Hiển thị' : 'Ẩn');
	}, [initialValues, reset]);

	// Fetch parent options
	const [parentOptions, setParentOptions] = useState([
		{ value: '', label: 'Chọn danh mục' }
	]);
	useEffect(() => {
		const fetchParents = async () => {
			const res = await categoryApi.fetchList({});

			if (res.status) {
				let parents = res.data;

				let newParentOptions = [
					{ value: '', label: 'Chọn danh mục' },
					...parents
						.filter(parent => parent._id !== initialValues._id)
						.map(parent => ({
							value: parent._id,
							label: parent.name
						}))
				];

				setParentOptions(newParentOptions);
			}
		};

		fetchParents();
	}, [initialValues]);

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
						name="name"
						label="Tên danh mục"
					/>
					<SelectField
						control={control}
						name="parent"
						label="Danh mục cấp trên"
						placeholder="Chọn danh mục"
						options={parentOptions}
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
