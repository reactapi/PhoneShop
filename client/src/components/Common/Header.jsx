import categoryApi from 'api/categoryApi';
import { selectCurrentUser } from 'app/authSlice';
import { selectCart } from 'app/cartSlice';
import { useEffect, useState } from 'react';
import {
	Badge,
	Container,
	Dropdown,
	Nav,
	Navbar,
	NavDropdown
} from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { NavLink, useHistory } from 'react-router-dom';
import { Confirm } from './Confirm';

export const Header = () => {
	const currentUser = useSelector(selectCurrentUser);
	const history = useHistory();

	const [categories, setCategories] = useState([]);
	useEffect(() => {
		const fetchCategories = async () => {
			const res = await categoryApi.fetchList({ status: true });

			if (res.status)
				setCategories(res.data.filter(category => !category.parent));
			else setCategories([]);
		};

		fetchCategories();
	}, []);

	// Logout confirm
	const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

	// Cart
	const cart = useSelector(selectCart);

	return (
		<Navbar bg="white" expand="lg" fixed="top" className="shadow">
			<Container fluid>
				<Navbar.Brand>
					<NavLink exact to="/" className="fw-bold text-dark">
						ITM
					</NavLink>
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="navbarScroll" />
				<Navbar.Collapse id="navbarScroll">
					<Nav>
						<NavLink exact to="/" className="nav-link">
							<i className="fas fa-fw fa-home" /> Trang chủ
						</NavLink>
						<NavDropdown
							title="Danh mục"
							id="navbarScrollingDropdown"
						>
							{categories.map(category => (
								<NavDropdown.Item
									key={category._id}
									as={NavLink}
									to={`/dien-thoai/${category.metaTitle}`}
								>
									{category.name}
								</NavDropdown.Item>
							))}
						</NavDropdown>
						<NavLink exact to="/dien-thoai" className="nav-link">
							Điện thoại
						</NavLink>
						<NavLink exact to="/lien-he" className="nav-link">
							Liên hệ
						</NavLink>
					</Nav>

					<Nav className="ms-auto mt-1">
						<NavLink exact to="/gio-hang" className="nav-link">
							<img
								src="/images/cart.png"
								width={25}
								height={25}
								alt="Giỏ hàng"
							/>{' '}
							{cart.length > 0 && (
								<Badge bg="danger" pill className="me-1">
									{cart.length}
								</Badge>
							)}
							Giỏ hàng
						</NavLink>

						{currentUser ? (
							<Dropdown className="nav-item no-arrow" align="end">
								<Dropdown.Toggle
									id="dropdown-basic"
									as={Nav.Link}
								>
									<span className="me-2 d-none d-lg-inline text-gray-600 small">
										{currentUser?.name}
									</span>
									<img
										className="img-profile rounded-circle border"
										src={currentUser?.avatar}
										alt={currentUser?.name}
										width={25}
										height={25}
									/>
								</Dropdown.Toggle>

								<Dropdown.Menu className="animated--grow-in">
									<Dropdown.Item as={NavLink} to="/ho-so">
										<i className="fas fa-fw fa-sm fa-user text-gray-400 me-2"></i>
										<span>Hồ sơ</span>
									</Dropdown.Item>
									<Dropdown.Item
										as={NavLink}
										to="/lich-su-dat-hang"
									>
										<i className="fas fa-fw fa-sm fa-list text-gray-400 me-2"></i>
										<span>Lịch sử đặt hàng</span>
									</Dropdown.Item>
									<Dropdown.Item as={NavLink} to="/cai-dat">
										<i className="fas fa-fw fa-sm fa-cog text-gray-400 me-2"></i>
										<span>Cài đặt</span>
									</Dropdown.Item>
									<Dropdown.Divider />
									<Dropdown.Item
										onClick={() =>
											setShowLogoutConfirm(true)
										}
									>
										<i className="fas fa-fw fa-sm fa-sign-out-alt text-gray-400 me-2"></i>
										<span>Đăng xuất</span>
									</Dropdown.Item>
									<Confirm
										show={showLogoutConfirm}
										message="Đăng xuất khỏi hệ thống?"
										onSuccess={() =>
											history.push('/dang-xuat')
										}
										onClose={() =>
											setShowLogoutConfirm(false)
										}
									/>
								</Dropdown.Menu>
							</Dropdown>
						) : (
							<>
								<NavLink
									exact
									to="/dang-nhap"
									className="nav-link"
								>
									<i className="fas fa-fw fa-sign-in-alt" />{' '}
									Đăng nhập
								</NavLink>
								<NavLink
									exact
									to="/dang-ky"
									className="nav-link"
								>
									<i className="fas fa-fw fa-user-plus" />{' '}
									Đăng ký
								</NavLink>
							</>
						)}
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};
