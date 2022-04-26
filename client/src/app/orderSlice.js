import orderApi from 'api/orderApi';

const { createSlice, createAsyncThunk } = require('@reduxjs/toolkit');

// Thunk
export const fetchOrders = createAsyncThunk('order/fetchOrders', async (params, thunkAPI) => {
	try {
		const res = await orderApi.fetch(params);

		if (res.status) return res;
		return null;
	} catch (error) {
		return null;
	}
});

// InitialState
const initialState = {
	loading: false,
	filter: {
		key: undefined,
		phone: undefined,
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

const orderSlice = createSlice({
	name: 'order',
	initialState,
	reducers: {
		// Filter
		setFilter(state, action) {
			state.filter = action.payload;

			return state;
		},

		// Orders
		setOrder: (state, action) => {
			const order = action.payload;
			const index = state.data.findIndex(x => x._id === order._id);
			state.data[index] = order;

			return state;
		},

		// SelectedItems
		setSelectedItems(state, action) {
			state.selectedItems = action.payload;
			return state;
		}
	},
	extraReducers: {
		[fetchOrders.pending]: state => {
			state.loading = true;
			return state;
		},
		[fetchOrders.fulfilled]: (state, action) => {
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

			// Return
			return state;
		}
	}
});

// Selectors
export const selectOrderLoading = state => state.order.loading;
export const selectOrderFilter = state => state.order.filter;
export const selectOrderSelectedItems = state => state.order.selectedItems;
export const selectOrders = state => state.order.data;
export const selectOrderPagination = state => state.order.pagination;

// Actions
export const orderActions = orderSlice.actions;

// Reducer
const orderReducer = orderSlice.reducer;
export default orderReducer;
