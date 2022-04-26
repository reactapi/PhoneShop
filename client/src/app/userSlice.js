import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import userApi from 'api/userApi';

export const fetchUsers = createAsyncThunk('user/fetchUsers', async (params, thunkAPI) => {
	try {
		const res = await userApi.fetchUsers(params);
		if (res.status) return res;
		return null;
	} catch (error) {
		return null;
	}
});

const initialState = {
	filter: {
		key: undefined,
		userGroup: 'ADMIN',
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

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		// Filter
		setFilter(state, action) {
			state.filter = action.payload;

			return state;
		},

		// Phones
		setUser: (state, action) => {
			const user = action.payload;
			const index = state.data.findIndex(x => x._id === user._id);
			state.data[index] = user;

			return state;
		},

		// SelectedItems
		setSelectedItems(state, action) {
			state.selectedItems = action.payload;
			return state;
		}
	},
	extraReducers: {
		[fetchUsers.pending]: state => {
			state.loading = true;
			return state;
		},
		[fetchUsers.fulfilled]: (state, action) => {
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
export const selectUserLoading = state => state.user.loading;
export const selectUserFilter = state => state.user.filter;
export const selectUserSelectedItems = state => state.user.selectedItems;
export const selectUsers = state => state.user.data;
export const selectUserPagination = state => state.user.pagination;

// Actions
export const userActions = userSlice.actions;

// Reducer
const userReducer = userSlice.reducer;
export default userReducer;
