import phoneApi from 'api/phoneApi';
import { SplitButton } from 'components/Buttons';
import { InputField } from 'components/FormFields/InputField';
import { SelectField } from 'components/FormFields/SelectField';
import { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

export const OrderFilter = props => {
	const { filter, onFilter, onReset } = props;
	const { control, reset, handleSubmit } = useForm({
		defaultValues: {
			key: filter.key || '',
			phone: filter.phone || '',
			status: filter.status || ''
		}
	});

	// phone Options
	const [phoneOptions, setPhoneOptions] = useState([
		{ value: '', label: 'Tất cả điện thoại' }
	]);

	useEffect(() => {
		const fetchPhones = async () => {
			const res = await phoneApi.fetchList({});

			if (res.status) {
				const newPhoneOptions = [
					{ value: '', label: 'Tất cả điện thoại' },
					...res.data.map(phone => ({
						value: phone._id,
						label: phone.name
					}))
				];

				setPhoneOptions(newPhoneOptions);
			} else {
				setPhoneOptions([{ value: '', label: 'Tất cả điện thoại' }]);
			}
		};

		fetchPhones();
	}, []);

	// Status options
	const statusOptions = [
		{ value: '', label: 'Tất cả trạng thái' },
		{ value: true, label: 'Đã thanh toán' },
		{ value: false, label: 'Chưa thanh toán' }
	];

	// Reset
	const handleReset = () => {
		const newFilter = {
			key: '',
			phone: '',
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
					placeholder="Họ tên / Số điện thoại / Địa chỉ"
				/>
			</Col>
			<Col lg={4} xl={2}>
				<SelectField
					control={control}
					name="phone"
					placeholder="Chọn điện thoại"
					options={phoneOptions}
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
					className="me-2 mb-4"
					onClick={handleReset}
				/>
			</Col>
		</Row>
	);
};
