import { SplitButton } from 'components/Buttons';
import { InputField } from 'components/FormFields/InputField';
import { SelectField } from 'components/FormFields/SelectField';
import { Col, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

export const FeedbackFilter = props => {
	const { filter, onFilter, onReset } = props;
	const { control, reset, handleSubmit } = useForm({
		defaultValues: {
			key: filter.key || '',
			status: filter.status || ''
		}
	});

	// Status options
	const statusOptions = [
		{ value: '', label: 'Tất cả trạng thái' },
		{ value: true, label: 'Đã xem' },
		{ value: false, label: 'Chưa xem' }
	];

	// Reset
	const handleReset = () => {
		const newFilter = {
			key: '',
			status: ''
		};

		reset(newFilter);
		onReset();
	};

	// Return
	return (
		<Row as="form" className="g-2">
			<Col lg={4} xl={4}>
				<InputField
					control={control}
					name="key"
					placeholder="Từ khóa"
				/>
			</Col>
			<Col lg={4} xl={4}>
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
