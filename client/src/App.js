import { getMe } from 'app/authSlice';
import AdminFeature from 'areas/Admin';
import { PrivateRoute } from 'areas/Admin/components/Common/PrivateRoute';
import { ClientLayout } from 'components/Layout/Client';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Switch } from 'react-router-dom';

const App = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getMe());
	}, [dispatch]);

	return (
		<Switch>
			<PrivateRoute path="/admin" component={AdminFeature} />
			<ClientLayout />
		</Switch>
	);
};

export default App;
