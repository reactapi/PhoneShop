import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import orderApi from 'api/orderApi';
import phoneApi from 'api/phoneApi';
import userApi from 'api/userApi';

export const fetchStatistics = createAsyncThunk(
	'dashboard/fetchStatistics',
	async (params, thunkAPI) => {
		try {
			const resAdmin = await userApi.fetchUsers({
				_page: 1,
				userGroup: 'ADMIN'
			});
			const resCustomer = await userApi.fetchUsers({
				_page: 1,
				userGroup: 'CUSTOMER'
			});
			const resPhone = await phoneApi.fetchList({ _page: 1 });

			const adminQuantity = resAdmin.pagination._totalRows;
			const customerQuantity = resCustomer.pagination._totalRows;
			const phoneQuantity = resPhone.pagination._totalRows;

			return { adminQuantity, customerQuantity, phoneQuantity };
		} catch (error) {
			return null;
		}
	}
);

export const fetchTopCustomers = createAsyncThunk(
	'dashboard/fetchTopCustomers',
	async (params, thunkAPI) => {
		try {
			const res = await orderApi.fetchTopCustomers(params);

			if (res.status) return res;
			else return null;
		} catch (error) {
			return null;
		}
	}
);

export const fetchTopPhones = createAsyncThunk(
	'dashboard/fetchTopPhones',
	async (params, thunkAPI) => {
		try {
			const res = await orderApi.fetchTopPhones(params);

			if (res.status) return res;
			else return null;
		} catch (error) {
			return null;
		}
	}
);

const initialState = {
	statistics: {
		loading: false,
		customerQuantity: 0,
		adminQuantity: 0,
		phoneQuantity: 0
	},
	topCustomers: {
		loading: false,
		data: []
	},
	topPhones: {
		loading: false,
		data: []
	}
};

const dashboardSlice = createSlice({
	name: 'dashboard',
	initialState,
	reducers: [],
	extraReducers: {
		// statistics
		[fetchStatistics.pending]: state => {
			state.statistics.loading = true;
			return state;
		},
		[fetchStatistics.fulfilled]: (state, action) => {
			if (action.payload) {
				state.statistics = {
					...state.statistics,
					...action.payload
				};
			}

			state.statistics.loading = false;

			return state;
		},

		// topCustomers
		[fetchTopCustomers.pending]: state => {
			state.topCustomers.loading = true;
			return state;
		},
		[fetchTopCustomers.fulfilled]: (state, action) => {
			if (action.payload) {
				state.topCustomers.data = action.payload.data;
			}

			state.topCustomers.loading = false;

			return state;
		},

		// topPhones
		[fetchTopPhones.pending]: state => {
			state.topPhones.loading = true;
			return state;
		},
		[fetchTopPhones.fulfilled]: (state, action) => {
			if (action.payload) {
				state.topPhones.data = action.payload.data;
			}

			state.topPhones.loading = false;

			return state;
		}
	}
});

// Selectors
export const selectDashboardStatistics = state => state.dashboard.statistics;
export const selectDashboardTopCustomers = state =>
	state.dashboard.topCustomers;
export const selectDashboardTopPhones = state => state.dashboard.topPhones;

// Reducer
const dashboardReducer = dashboardSlice.reducer;
export default dashboardReducer;
