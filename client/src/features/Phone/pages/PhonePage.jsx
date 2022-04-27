import categoryApi from 'api/categoryApi';
import {
	fetchPhones,
	phoneActions,
	selectPhoneFilter,
	selectPhoneLoading,
	selectPhonePagination,
	selectPhones
} from 'app/phoneSlice';
import Banner from 'components/Common/Banner';
import { ITMPagination } from 'components/Common/ITMPagination';
import { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { PhoneList } from '../components';

const PhonePage = props => {
	const dispatch = useDispatch();
	const history = useHistory();

	// Category
	const { categoryMetaTitle } = useParams();
	const [category, setCategory] = useState(null);
	const [isSettedDefaultFilter, setIsSettedDefaultFilter] = useState(false);
	useEffect(() => {
		const fetchCategory = async () => {
			const res = await categoryApi.fetch(categoryMetaTitle);

			if (res.status) {
				setCategory(res.category);
				dispatch(
					phoneActions.setFilter({
						category: res.category._id,
						status: true,
						_page: 1,
						_limit: 8
					})
				);
			} else {
				history.push('/404');
			}

			setIsSettedDefaultFilter(true);
		};

		if (categoryMetaTitle) fetchCategory();
		else {
			setCategory(null);
			dispatch(
				phoneActions.setFilter({
					category: undefined,
					status: true,
					_page: 1,
					_limit: 8
				})
			);

			setIsSettedDefaultFilter(true);
		}
	}, [history, dispatch, categoryMetaTitle]);

	// Loading
	const loading = useSelector(selectPhoneLoading);

	// Filter
	const filter = useSelector(selectPhoneFilter);

	// Fetch phones
	const phones = useSelector(selectPhones);
	useEffect(() => {
		if (filter.category) {
			dispatch(fetchPhones(filter));
		}
	}, [dispatch, filter]);

	useEffect(() => {
		if (!categoryMetaTitle && !filter.category && isSettedDefaultFilter)
			dispatch(fetchPhones(filter));
	}, [dispatch, categoryMetaTitle, filter, isSettedDefaultFilter]);

	// Pagination
	const pagination = useSelector(selectPhonePagination);

	const handlePageChange = _page => {
		if (_page !== pagination._page)
			dispatch(
				phoneActions.setFilter({
					...filter,
					_page,
					_limit: pagination._limit
				})
			);
	};

	// Return
	return (
		<div className="p-5">
			<Banner />

			<div className="bg-white rounded shadow">
				<div className="phdr">
					{category?.name || 'Điện thoại di động'}
				</div>
				<div className="p-3">
					{loading ? null : phones.length > 0 ? (
						<>
							<PhoneList phones={phones} />
							<ITMPagination
								pagination={pagination}
								onChange={handlePageChange}
							/>
						</>
					) : (
						<Alert variant="danger" className="mb-0">
							Chưa có điện thoại
						</Alert>
					)}
				</div>
			</div>
		</div>
	);
};

export default PhonePage;
