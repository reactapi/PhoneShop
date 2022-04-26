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

	const [category, setCategory] = useState({});
	useEffect(() => {
		const fetchCategory = async () => {
			if (categoryMetaTitle) {
				const res = await categoryApi.fetch(categoryMetaTitle);

				if (res.status) {
					setCategory(res.category);
				} else {
					history.push('/404');
				}
			}
		};

		fetchCategory();
	}, [history, categoryMetaTitle]);

	// Filter
	const filter = useSelector(selectPhoneFilter);
	useEffect(() => {
		dispatch(
			phoneActions.setFilter({
				category: category._id,
				status: true,
				_page: 1,
				_limit: 8
			})
		);
	}, [dispatch, category._id]);

	// Loading
	const loading = useSelector(selectPhoneLoading);

	// Fetch phones
	const phones = useSelector(selectPhones);
	useEffect(() => {
		dispatch(fetchPhones(filter));
	}, [dispatch, filter]);

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
