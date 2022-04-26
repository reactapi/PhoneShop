import authApi from 'api/authApi';

const { createSlice, createAsyncThunk } = require('@reduxjs/toolkit');

const initialState = {
	loading: true,
	currentUser: null
};

export const getMe = createAsyncThunk('/auth/getMe', async (params, thunkAPI) => {
	try {
		const accessToken = localStorage.getItem('accessToken');

		if (accessToken) {
			const res = await authApi.getMe();

			if (res.status) return res;
			return null;
		}

		return null;
	} catch (error) {
		return null;
	}
});

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setCurrentUser: (state, action) => {
			state.currentUser = action.payload;

			return state;
		}
	},
	extraReducers: {
		[getMe.pending]: state => {
			state.loading = true;

			return state;
		},
		[getMe.fulfilled]: (state, action) => {
			state.loading = false;
			state.currentUser = action.payload?.user || undefined;

			return state;
		},
		[getMe.rejected]: state => {
			state.loading = false;
			state.currentUser = undefined;

			return state;
		}
	}
});

// Selections
export const selectAuthLoading = state => state.auth.loading;
export const selectCurrentUser = state => state.auth.currentUser;

// Actions
export const authActions = authSlice.actions;

// Reducer
const authReducer = authSlice.reducer;
export default authReducer;
