import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';

export const CircleButton = props => {
	const { className, icon, title, ...buttonProps } = props;

	return (
		<OverlayTrigger placement="left" overlay={<Tooltip>{title}</Tooltip>}>
			<Button className={`btn-circle${className ? ` ${className}` : ''}`} {...buttonProps}>
				<i className={icon}></i>
			</Button>
		</OverlayTrigger>
	);
};
