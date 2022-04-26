import categoryApi from 'api/categoryApi';

const { createSlice, createAsyncThunk } = require('@reduxjs/toolkit');

// Thunk
export const fetchCategories = createAsyncThunk(
	'category/fetchCategories',
	async (params, thunkAPI) => {
		try {
			const res = await categoryApi.fetchList(params);

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
		parent: undefined,
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

const categorySlice = createSlice({
	name: 'category',
	initialState,
	reducers: {
		// Filter
		setFilter(state, action) {
			state.filter = action.payload;

			return state;
		},

		// Categories
		setCategory: (state, action) => {
			const category = action.payload;
			const index = state.data.findIndex(x => x._id === category._id);
			state.data[index] = category;

			return state;
		},

		// SelectedItems
		setSelectedItems(state, action) {
			state.selectedItems = action.payload;
			return state;
		}
	},
	extraReducers: {
		[fetchCategories.pending]: state => {
			state.loading = true;
			return state;
		},
		[fetchCategories.fulfilled]: (state, action) => {
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
export const selectCategoryLoading = state => state.category.loading;
export const selectCategoryFilter = state => state.category.filter;
export const selectCategorySelectedItems = state => state.category.selectedItems;
export const selectCategories = state => state.category.data;
export const selectCategoryPagination = state => state.category.pagination;

// Actions
export const categoryActions = categorySlice.actions;

// Reducer
const categoryReducer = categorySlice.reducer;
export default categoryReducer;
