import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const MenuItem = props => {
	const { href, icon, title } = props;
	const active = window.location.pathname === href;

	return (
		<Nav.Item as="li" className={active ? 'active' : ''}>
			<Link className="nav-link" to={href}>
				<i className={icon}></i>
				<span>{title}</span>
			</Link>
		</Nav.Item>
	);
};
