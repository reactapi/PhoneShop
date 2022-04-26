import discountApi from 'api/discountApi';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Thunk
export const fetchDiscounts = createAsyncThunk(
	'discount/fetchDiscounts',
	async (params, thunkAPI) => {
		try {
			const res = await discountApi.fetchList(params);

			if (res.status) return res;
			return null;
		} catch (error) {
			return null;
		}
	}
);

// InitialState
const initialState = {
	loading: false,
	filter: {
		key: undefined,
		code: undefined,
		status: undefined,
		_page: 1,
		_limit: 10
	},
	selectedItems: [],
	data: [],
	pagination: {
		_page: 1,
		_limit: 10,
		_totalPages: 0
	}
};

const discountSlice = createSlice({
	name: 'discount',
	initialState,
	reducers: {
		// Filter
		setFilter(state, action) {
			state.filter = action.payload;

			return state;
		},

		// Discounts
		setDiscount: (state, action) => {
			const discount = action.payload;
			const index = state.data.findIndex(x => x._id === discount._id);
			state.data[index] = discount;

			return state;
		},

		// SelectedItems
		setSelectedItems(state, action) {
			state.selectedItems = action.payload;
			return state;
		}
	},
	extraReducers: {
		[fetchDiscounts.pending]: state => {
			state.loading = true;
			return state;
		},
		[fetchDiscounts.fulfilled]: (state, action) => {
			if (action.payload) {
				const { data, pagination } = action.payload;
				const { _limit, _totalRows } = pagination;
				let _page = pagination._page;
				const _totalPages = Math.ceil(_totalRows / _limit);

				// Check page valid
				if (_page < 1) _page = 1;
				if (_totalPages > 0 && _page > _totalPages) _page = _totalPages;

				// Set state
				state.filter._page = _page;
				state.data = data;
				state.pagination = {
					_page,
					_limit,
					_totalPages
				};
			}

			state.loading = false;

			return state;
		}
	}
});

// Selectors
export const selectDiscountLoading = state => state.discount.loading;
export const selectDiscountFilter = state => state.discount.filter;
export const selectDiscountSelectedItems = state => state.discount.selectedItems;
export const selectDiscounts = state => state.discount.data;
export const selectDiscountPagination = state => state.discount.pagination;

// Actions
export const discountActions = discountSlice.actions;

// Reducer
const discountReducer = discountSlice.reducer;
export default discountReducer;
