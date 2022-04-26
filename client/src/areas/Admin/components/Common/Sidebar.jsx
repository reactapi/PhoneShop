import { Link } from 'react-router-dom';
import { MenuCollapseItem, MenuItem } from '.';

export const Sidebar = props => {
	const { sidebar, theme, hanldeShow } = props;
	const { show, menu } = sidebar;
	const themeColor = theme.color;

	return (
		<ul
			className={
				show
					? `navbar-nav bg-gradient-${themeColor} sidebar sidebar-dark accordion`
					: `navbar-nav bg-gradient-${themeColor} sidebar sidebar-dark accordion toggled`
			}
			id="accordionSidebar"
		>
			<Link className="sidebar-brand d-flex align-items-center justify-content-center" to="/admin/dashboard">
				<div className="sidebar-brand-text mx-3">ADMIN</div>
			</Link>
			<hr className="sidebar-divider my-0"></hr>

			{menu.map(item => {
				if (item.type === 'item') return <MenuItem key={item.href} {...item} />;
				else return <MenuCollapseItem key={item.name} {...item} />;
			})}

			<hr className="sidebar-divider d-none d-md-block" />
			<div className="text-center d-none d-md-inline">
				<button
					className="rounded-circle border-0"
					id="sidebarToggle"
					onClick={hanldeShow}
				></button>
			</div>
		</ul>
	);
};
