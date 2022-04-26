import { Form } from 'react-bootstrap';
import { useController } from 'react-hook-form';
import Select from 'react-select';

export const SelectField = props => {
	const { control, name, label, options, ...selectProps } = props;
	const {
		field: { value, onChange, ref },
		fieldState: { invalid, error }
	} = useController({ name, control });
	const selectedOption = options.find(option => option.value === value);

	const handleSelectOptionChange = selectedOption => {
		const selectedValue = selectedOption ? selectedOption.value : selectedOption;

		onChange(selectedValue);
	};

	return (
		<Form.Group className="mb-3">
			{label && <Form.Label>{label}</Form.Label>}
			<Select
				name={name}
				value={selectedOption}
				onChange={handleSelectOptionChange}
				{...selectProps}
				ref={ref}
				options={options}
				className={`react-select ${invalid && ' is-invalid'}`}
			/>
			<Form.Control.Feedback type="invalid">{error?.message}</Form.Control.Feedback>
		</Form.Group>
	);
};
