import { Form } from 'react-bootstrap'
import { useController } from 'react-hook-form'

export const InputField = props => {
	const { control, size, name, label, ...inputProps } = props
	const {
		field: { value, onChange, onBlur, ref },
		fieldState: { invalid, error }
	} = useController({ name, control })

	return (
		<Form.Group className="mb-3">
			{label && <Form.Label>{label}</Form.Label>}
			<Form.Control
				name={name}
				ref={ref}
				value={value}
				onChange={onChange}
				onBlur={onBlur}
				isInvalid={invalid}
				{...inputProps}
			/>
			<Form.Control.Feedback type="invalid">
				{error?.message}
			</Form.Control.Feedback>
		</Form.Group>
	)
}
