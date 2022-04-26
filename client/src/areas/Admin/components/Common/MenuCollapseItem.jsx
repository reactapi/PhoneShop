import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

export const MenuCollapseItem = props => {
	const { name, icon, title, items } = props;
	const active = items.list.findIndex(item => item.href === window.location.pathname) >= 0;
	const sharpUrl = '#';

	return (
		<Nav.Item as="li" className={active ? 'active' : ''}>
			<a
				className={active ? 'nav-link' : 'nav-link collapsed'}
				href={sharpUrl}
				data-bs-toggle="collapse"
				data-bs-target={`#collapse${name}`}
				aria-expanded="true"
				aria-controls={`collapse${name}`}
			>
				<i className={icon}></i>
				<span>{title}</span>
			</a>
			<div id={`collapse${name}`} className={active ? 'collapse show' : 'collapse'}>
				<div className="bg-white py-2 collapse-inner rounded">
					{items.title && <h6 className="collapse-header">{items.title}</h6>}
					{items.list.map(item => (
						<NavLink key={item.href} className="collapse-item" to={item.href}>
							{item.title}
						</NavLink>
					))}
				</div>
			</div>
		</Nav.Item>
	);
};
