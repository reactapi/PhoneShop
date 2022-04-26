import { selectAuthLoading, selectCurrentUser } from 'app/authSlice';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Route, useHistory } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';

export const PrivateRoute = props => {
	const history = useHistory();

	const authLoading = useSelector(selectAuthLoading);
	const currentUser = useSelector(selectCurrentUser);

	useEffect(() => {
		if (!authLoading && (!currentUser || currentUser?.userGroup?.name !== 'ADMIN')) {
			history.push('/admin/login');
			return;
		}
	}, [history, authLoading, currentUser]);

	const [loadingTimmer, setLoadingTimmer] = useState(0.5);
	useEffect(() => {
		const timmer = setTimeout(() => {
			if (loadingTimmer > 0) setLoadingTimmer(loadingTimmer - 0.1);
		}, 100);

		return () => clearTimeout(timmer);
	}, [loadingTimmer]);

	return loadingTimmer > 0 ? (
		<div style={{ height: '100vh' }} className="d-flex">
			<Spinner animation="border" variant="primary" className="m-auto" />
		</div>
	) : (
		<Route {...props} />
	);
};
