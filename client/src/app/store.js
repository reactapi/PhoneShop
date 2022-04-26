import { configureStore } from '@reduxjs/toolkit';
import adminReducer from './admin';
import dashboardReducer from './dashboard';
import authReducer from './authSlice';
import cartReducer from './cartSlice';
import categoryReducer from './categorySlice';
import orderReducer from './orderSlice';
import phoneReducer from './phoneSlice';
import userReducer from './userSlice';
import discountReducer from './discountSlice';
import feedbackReducer from './feedbackSlice';
import bannerReducer from './bannerSlice';

const rootReducer = {
	admin: adminReducer,
	dashboard: dashboardReducer,
	auth: authReducer,
	cart: cartReducer,
	category: categoryReducer,
	phone: phoneReducer,
	order: orderReducer,
	user: userReducer,
	discount: discountReducer,
	feedback: feedbackReducer,
	banner: bannerReducer
};

const store = configureStore({
	reducer: rootReducer
});

export default store;
