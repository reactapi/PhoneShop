import categoryApi from 'api/categoryApi';
import { SplitButton } from 'components/Buttons';
import { InputField } from 'components/FormFields/InputField';
import { SelectField } from 'components/FormFields/SelectField';
import { useState } from 'react';
import { useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

export const PhoneFilter = props => {
	const { filter, onFilter, onReset } = props;
	const { control, reset, handleSubmit } = useForm({
		defaultValues: {
			key: filter.key || '',
			category: filter.category || '',
			status: filter.status || ''
		}
	});

	// Fetch category options
	const [categoryOptions, setCategoryOptions] = useState([
		{ value: '', label: 'Tất cả danh mục' }
	]);
	useEffect(() => {
		const fetchCategories = async () => {
			const res = await categoryApi.fetchList({});

			if (res.status) {
				let categories = res.data;

				let newCategoryOptions = [
					{ value: '', label: 'Tất cả danh mục' },
					...categories.map(category => ({
						value: category._id,
						label: category.name
					}))
				];

				setCategoryOptions(newCategoryOptions);
			}
		};

		fetchCategories();
		reset({
			key: filter.key || '',
			category: filter.category || '',
			status: filter.status || ''
		});
	}, [filter, reset]);

	// Status options
	const statusOptions = [
		{ value: '', label: 'Tất cả trạng thái' },
		{ value: true, label: 'Hiển thị' },
		{ value: false, label: 'Ẩn' }
	];

	// Reset
	const handleReset = () => {
		const newFilter = {
			key: '',
			category: '',
			status: ''
		};

		reset(newFilter);
		onReset();
	};

	// Return
	return (
		<Row as="form" className="g-2">
			<Col lg={4} xl={3}>
				<InputField
					control={control}
					name="key"
					placeholder="Tên điện thoại"
				/>
			</Col>
			<Col lg={4} xl={3}>
				<SelectField
					control={control}
					name="category"
					placeholder="Chọn danh mục"
					options={categoryOptions}
				/>
			</Col>
			<Col lg={4} xl={2}>
				<SelectField
					control={control}
					name="status"
					placeholder="Chọn trạng thái"
					options={statusOptions}
				/>
			</Col>
			<Col xl="auto">
				<SplitButton
					type="submit"
					icon="fas fa-fw fa-search"
					text="Tìm kiếm"
					className="me-2 mb-4"
					onClick={handleSubmit(onFilter)}
				/>
				<SplitButton
					type="button"
					icon="fas fa-fw fa-sync-alt"
					text="Làm mới"
					className="mb-4"
					onClick={handleReset}
				/>
			</Col>
		</Row>
	);
};
