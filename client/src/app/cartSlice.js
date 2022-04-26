import { createSlice } from '@reduxjs/toolkit';

export const getCart = () => {
	const cart = JSON.parse(localStorage.getItem('cart'));

	if (cart) return cart;
	else return [];
};

const cartSlice = createSlice({
	name: 'cart',
	initialState: getCart(),
	reducers: {
		add(state, action) {
			const index = state.findIndex(
				item =>
					item.phone._id === action.payload.phone._id &&
					item.model.rom === action.payload.model.rom &&
					item.model.ram === action.payload.model.ram &&
					item.model.color === action.payload.model.color
			);

			if (index >= 0)
				state[index].quantity =
					state[index].quantity + action.payload.quantity;
			else state = [...state, action.payload];
			localStorage.setItem('cart', JSON.stringify(state));

			return state;
		},
		updateItem(state, action) {
			const index = state.findIndex(
				item =>
					item.phone._id === action.payload.phone._id &&
					item.model.rom === action.payload.model.rom &&
					item.model.ram === action.payload.model.ram &&
					item.model.color === action.payload.model.color
			);

			state[index] = action.payload;
			localStorage.setItem('cart', JSON.stringify(state));

			return state;
		},
		removeItem(state, action) {
			const index = state.findIndex(
				item =>
					item.phone._id === action.payload.phone._id &&
					item.model.rom === action.payload.model.rom &&
					item.model.ram === action.payload.model.ram &&
					item.model.color === action.payload.model.color
			);

			state.splice(index, 1);
			localStorage.setItem('cart', JSON.stringify(state));

			return state;
		},
		removeAll(state, action) {
			state = [];
			localStorage.removeItem('cart');

			return state;
		}
	}
});

// Seletors
export const selectCart = state => state.cart;

// Actions
export const cartActions = cartSlice.actions;

// Reducer
const cartReducer = cartSlice.reducer;
export default cartReducer;
