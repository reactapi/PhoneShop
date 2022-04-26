import { selectCurrentUser } from 'app/authSlice';
import { Confirm } from 'components/Common/Confirm';
import { useState } from 'react';
import { Dropdown, Nav, Navbar } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { NavLink, useHistory } from 'react-router-dom';

export const Header = props => {
	const { handleShowSidebar } = props;
	const currentUser = useSelector(selectCurrentUser);
	const history = useHistory();

	// Logout confirm
	const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

	return (
		<Navbar bg="white" expand className="mb-4 shadow topbar static-top">
			<button
				id="sidebarToggleTop"
				className="btn btn-link d-md-none rounded-circle me-3"
				onClick={handleShowSidebar}
			>
				<i className="fa fa-bars"></i>
			</button>
			<ul className="navbar-nav ms-auto">
				<div className="topbar-divider d-none d-sm-block"></div>

				<Dropdown as="li" className="nav-item no-arrow" align="end">
					<Dropdown.Toggle id="menu-profile" as={Nav.Link}>
						<span className="me-2 d-none d-lg-inline text-gray-600 small">
							{currentUser?.name}
						</span>
						<img
							className="img-profile rounded-circle"
							src={currentUser?.avatar}
							alt={currentUser?.name}
						/>
					</Dropdown.Toggle>

					<Dropdown.Menu className="animated--grow-in">
						<Dropdown.Item as={NavLink} to="/admin/profile">
							<i className="fas fa-fw fa-sm fa-user text-gray-400 me-2"></i>
							<span>Hồ sơ</span>
						</Dropdown.Item>
						<Dropdown.Item as={NavLink} to="/admin/settings">
							<i className="fas fa-fw fa-sm fa-cog text-gray-400 me-2"></i>
							<span>Cài đặt</span>
						</Dropdown.Item>
						<Dropdown.Divider />

						<Dropdown.Item as={NavLink} to="/admin/logout">
							<i className="fas fa-fw fa-sm fa-sign-out-alt text-gray-400 me-2"></i>
							<span>Đăng xuất</span>
						</Dropdown.Item>
						<Confirm
							show={showLogoutConfirm}
							message="Đăng xuất khỏi hệ thống?"
							onSuccess={() => history.push('/dang-xuat')}
							onClose={() => setShowLogoutConfirm(false)}
						/>
					</Dropdown.Menu>
				</Dropdown>
			</ul>
		</Navbar>
	);
};
