import phoneApi from 'api/phoneApi';

const { createSlice, createAsyncThunk } = require('@reduxjs/toolkit');

// Thunk
export const fetchPhones = createAsyncThunk(
	'phone/fetchPhones',
	async (params, thunkAPI) => {
		try {
			const res = await phoneApi.fetchList(params);

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
		category: undefined,
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

const phoneSlice = createSlice({
	name: 'phone',
	initialState,
	reducers: {
		// Filter
		setFilter(state, action) {
			state.filter = action.payload;

			return state;
		},

		// Phones
		setPhone: (state, action) => {
			const phone = action.payload;
			const index = state.data.findIndex(x => x._id === phone._id);
			state.data[index] = phone;

			return state;
		},

		// SelectedItems
		setSelectedItems(state, action) {
			state.selectedItems = action.payload;
			return state;
		}
	},
	extraReducers: {
		[fetchPhones.pending]: state => {
			state.loading = true;
			return state;
		},
		[fetchPhones.fulfilled]: (state, action) => {
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
export const selectPhoneLoading = state => state.phone.loading;
export const selectPhoneFilter = state => state.phone.filter;
export const selectPhoneSelectedItems = state => state.phone.selectedItems;
export const selectPhones = state => state.phone.data;
export const selectPhonePagination = state => state.phone.pagination;

// Actions
export const phoneActions = phoneSlice.actions;

// Reducer
const phoneReducer = phoneSlice.reducer;
export default phoneReducer;
