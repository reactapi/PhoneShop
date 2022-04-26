import bannerApi from 'api/bannerApi';

const { createSlice, createAsyncThunk } = require('@reduxjs/toolkit');

// Thunk
export const fetchBanners = createAsyncThunk(
	'banner/fetchBanners',
	async (params, thunkAPI) => {
		try {
			const res = await bannerApi.fetchList(params);

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

const bannerSlice = createSlice({
	name: 'banner',
	initialState,
	reducers: {
		// Filter
		setFilter(state, action) {
			state.filter = action.payload;

			return state;
		},

		// Banners
		setBanner: (state, action) => {
			const banner = action.payload;
			const index = state.data.findIndex(x => x._id === banner._id);
			state.data[index] = banner;

			return state;
		},

		// SelectedItems
		setSelectedItems(state, action) {
			state.selectedItems = action.payload;
			return state;
		}
	},
	extraReducers: {
		[fetchBanners.pending]: state => {
			state.loading = true;
			return state;
		},
		[fetchBanners.fulfilled]: (state, action) => {
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
export const selectBannerLoading = state => state.banner.loading;
export const selectBannerFilter = state => state.banner.filter;
export const selectBannerSelectedItems = state => state.banner.selectedItems;
export const selectBanners = state => state.banner.data;
export const selectBannerPagination = state => state.banner.pagination;

// Actions
export const bannerActions = bannerSlice.actions;

// Reducer
const bannerReducer = bannerSlice.reducer;
export default bannerReducer;
