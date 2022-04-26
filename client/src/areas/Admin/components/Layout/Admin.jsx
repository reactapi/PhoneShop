import { adminActions, selectSidebar, selectTheme } from 'app/admin';
import BannerPage from 'areas/Admin/features/Banner';
import CategoryPage from 'areas/Admin/features/Category';
import DashboardPage from 'areas/Admin/features/Dashboard';
import DiscountPage from 'areas/Admin/features/Discount';
import FeedbackPage from 'areas/Admin/features/Feedback';
import Order from 'areas/Admin/features/Order';
import PhonePage from 'areas/Admin/features/Phone';
import UserPage from 'areas/Admin/features/User';
import { NotFound } from 'components/Common';
import LoginPage from 'features/Auth/pages/LoginPage';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { Footer, Header, Sidebar } from '../Common';

export const AdminLayout = () => {
	const dispatch = useDispatch();
	const sidebar = useSelector(selectSidebar);
	const theme = useSelector(selectTheme);
	const handleShowSidebar = () => {
		dispatch(adminActions.setShowSidebar(!sidebar.show));
	};

	return (
		<div id="wrapper">
			<Sidebar
				sidebar={sidebar}
				theme={theme}
				hanldeShow={handleShowSidebar}
			/>
			<div id="content-wrapper" className="d-flex flex-column">
				<div id="content">
					<Header handleShowSidebar={handleShowSidebar} />
					<div className="container-fluid">
						<Switch>
							<Route exact path="/admin/logout">
								<LoginPage isAdmin={true} isLogin={false} />
							</Route>
							<Route
								exact
								path="/admin/dashboard"
								component={DashboardPage}
							/>
							<Route
								exact
								path="/admin/category"
								component={CategoryPage}
							/>
							<Route path="/admin/phone" component={PhonePage} />
							<Route
								exact
								path="/admin/order"
								component={Order}
							/>
							<Route
								exact
								path="/admin/discount"
								component={DiscountPage}
							/>
							<Route
								exact
								path="/admin/feedback"
								component={FeedbackPage}
							/>
							<Route
								exact
								path="/admin/banner"
								component={BannerPage}
							/>
							<Route exact path="/admin/user/admin">
								<UserPage isAdmin={true} />
							</Route>
							<Route exact path="/admin/user/customer">
								<UserPage />
							</Route>

							<Route>
								<NotFound isAdmin={true} />
							</Route>
						</Switch>
					</div>
				</div>
				<Footer />
			</div>
		</div>
	);
};
