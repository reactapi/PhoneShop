import { NotFound } from 'components/Common/NotFound';
import { Route, Switch } from 'react-router-dom';
import PhoneDetailPage from './pages/PhoneDetailPage';
import PhonePage from './pages/PhonePage';

const PhoneFeature = () => {
	return (
		<Switch>
			<Route exact path="/dien-thoai" component={PhonePage} />
			<Route
				exact
				path="/dien-thoai/:categoryMetaTitle"
				component={PhonePage}
			/>
			<Route
				exact
				path="/dien-thoai/:categoryMetaTitle/:phoneMetaTitle"
				component={PhoneDetailPage}
			/>
			<Route path="*" component={NotFound} />
		</Switch>
	);
};

export default PhoneFeature;
