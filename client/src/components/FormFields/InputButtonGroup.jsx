import { SplitButton } from 'components/Buttons';
import { Form, InputGroup } from 'react-bootstrap';
import { useController } from 'react-hook-form';

export const InputButtonGroup = props => {
	const { input, button, ...groupProps } = props;
	const { control, size, name, label, ...inputProps } = input;
	const {
		field: { value, onChange, onBlur, ref },
		fieldState: { invalid, error }
	} = useController({ name, control });

	return (
		<Form.Group className="mb-3" {...groupProps}>
			{label && <Form.Label>{label}</Form.Label>}
			<InputGroup>
				<Form.Control
					name={name}
					ref={ref}
					value={value}
					onChange={onChange}
					onBlur={onBlur}
					isInvalid={invalid}
					{...inputProps}
				/>
				<SplitButton {...button} />
			</InputGroup>
			<Form.Control.Feedback type="invalid">{error?.message}</Form.Control.Feedback>
		</Form.Group>
	);
};
