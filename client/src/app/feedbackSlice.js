import feedbackApi from 'api/feedbackApi';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Thunk
export const fetchFeedbacks = createAsyncThunk(
	'feedback/fetchFeedbacks',
	async (params, thunkAPI) => {
		try {
			const res = await feedbackApi.fetchList(params);

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

const feedbackSlice = createSlice({
	name: 'feedback',
	initialState,
	reducers: {
		// Filter
		setFilter(state, action) {
			state.filter = action.payload;

			return state;
		},

		// Categories
		setFeedback: (state, action) => {
			const feedback = action.payload;
			const index = state.data.findIndex(x => x._id === feedback._id);
			state.data[index] = feedback;

			return state;
		},

		// SelectedItems
		setSelectedItems(state, action) {
			state.selectedItems = action.payload;
			return state;
		}
	},
	extraReducers: {
		[fetchFeedbacks.pending]: state => {
			state.loading = true;
			return state;
		},
		[fetchFeedbacks.fulfilled]: (state, action) => {
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
export const selectFeedbackLoading = state => state.feedback.loading;
export const selectFeedbackFilter = state => state.feedback.filter;
export const selectFeedbackSelectedItems = state =>
	state.feedback.selectedItems;
export const selectFeedbacks = state => state.feedback.data;
export const selectFeedbackPagination = state => state.feedback.pagination;

// Actions
export const feedbackActions = feedbackSlice.actions;

// Reducer
const feedbackReducer = feedbackSlice.reducer;
export default feedbackReducer;
