import categoryApi from 'api/categoryApi';
import { SplitButton } from 'components/Buttons';
import { InputField } from 'components/FormFields/InputField';
import { SelectField } from 'components/FormFields/SelectField';
import { useState } from 'react';
import { useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

export const CategoryFilter = props => {
	const { filter, onFilter, onReset } = props;
	const { control, reset, handleSubmit } = useForm({
		defaultValues: {
			key: filter.key || '',
			parent: filter.parent || '',
			status: filter.status || ''
		}
	});

	// Fetch parent options
	const [parentOptions, setParentOptions] = useState([
		{ value: '', label: 'Tất cả danh mục cấp trên' }
	]);
	useEffect(() => {
		const fetchParents = async () => {
			const res = await categoryApi.fetchList({});

			if (res.status) {
				let parents = res.data;

				let newParentOptions = [
					{ value: '', label: 'Tất cả danh mục cấp trên' },
					...parents.map(parent => ({
						value: parent._id,
						label: parent.name
					}))
				];

				setParentOptions(newParentOptions);
			}
		};

		fetchParents();
		reset({
			key: filter.key || '',
			parent: filter.parent || '',
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
			parent: '',
			status: ''
		};

		reset(newFilter);
		onReset();
	};

	// Return
	return (
		<Row as="form" className="g-2">
			<Col lg={4} xl={2}>
				<InputField control={control} name="key" placeholder="Từ khóa" />
			</Col>
			<Col lg={4} xl={2}>
				<SelectField
					control={control}
					name="parent"
					placeholder="Chọn danh mục"
					options={parentOptions}
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
					className="me-2 mb-3"
					onClick={handleSubmit(onFilter)}
				/>
				<SplitButton
					type="button"
					icon="fas fa-fw fa-sync-alt"
					text="Làm mới"
					className="mb-3"
					onClick={handleReset}
				/>
			</Col>
		</Row>
	);
};
