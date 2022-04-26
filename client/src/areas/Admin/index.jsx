import LoginPage from 'features/Auth/pages/LoginPage';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { PrivateRoute } from './components/Common/PrivateRoute';
import { AdminLayout } from './components/Layout/Admin';

const AdminFeature = () => {
	return (
		<BrowserRouter>
			<Switch>
				<Route exact path="/admin/login">
					<LoginPage isAdmin={true} isLogin={true} />
				</Route>

				<Redirect exact path="/admin" to="/admin/dashboard" />
				<Redirect exact path="/admin/home" to="/admin/dashboard" />
				<PrivateRoute path="/admin" component={AdminLayout} />
			</Switch>
		</BrowserRouter>
	);
};

export default AdminFeature;
