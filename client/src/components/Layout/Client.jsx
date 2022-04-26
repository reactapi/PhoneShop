import { NotFound } from 'components/Common';
import { Footer } from 'components/Common/Footer';
import { Header } from 'components/Common/Header';
import LoginPage from 'features/Auth/pages/LoginPage';
import RegisterPage from 'features/Auth/pages/RegisterPage';
import CartPage from 'features/Cart/pages/CartPage';
import ContactPage from 'features/Home/pages/ContactPage';
import HomePage from 'features/Home/pages/HomePage';
import OrderHistoryPage from 'features/Order/pages/OrderHistoryPage';
import PhoneFeature from 'features/Phone';
import { Route, Switch } from 'react-router-dom';

export const ClientLayout = () => {
	return (
		<div>
			<Header />

			<div style={{ marginTop: 63 }} className="bg-light">
				<Switch>
					<Route exact path="/" component={HomePage} />
					<Route exact path="/lien-he" component={ContactPage} />
					<Route exact path="/gio-hang" component={CartPage} />
					<Route exact path="/lich-su-dat-hang" component={OrderHistoryPage} />
					<Route path="/dang-nhap">
						<LoginPage isLogin={true} />
					</Route>
					<Route path="/dang-xuat">
						<LoginPage isLogin={false} />
					</Route>
					<Route path="/dang-ky" component={RegisterPage} />
					<Route path="/" component={PhoneFeature} />

					<Route component={NotFound} />
				</Switch>
			</div>

			<Footer />
		</div>
	);
};
