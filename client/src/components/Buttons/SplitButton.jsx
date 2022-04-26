import { Button } from 'react-bootstrap';

export const SplitButton = props => {
	const { className, icon, text, ...buttonProps } = props;

	return (
		<Button
			className={`btn-icon-split${className ? ` ${className}` : ''}`}
			{...buttonProps}
		>
			<span className="icon text-white-50">
				<i className={icon}></i>
			</span>
			<span className="text">{text}</span>
		</Button>
	);
};
