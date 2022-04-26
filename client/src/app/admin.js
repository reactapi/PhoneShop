const { createSlice } = require('@reduxjs/toolkit');

const initialState = {
	theme: {
		color: 'primary'
	},
	sidebar: {
		show: true,
		menu: [
			{
				type: 'item',
				href: '/admin/dashboard',
				icon: 'fas fa-home',
				title: 'Dashboard'
			},
			{
				type: 'collapsedItem',
				name: 'phone',
				icon: 'fas fa-fw fa-mobile-button',
				title: 'Điện thoại',
				items: {
					list: [
						{ href: '/admin/category', title: 'Danh mục' },
						{ href: '/admin/phone', title: 'Điện thoại' },
						{ href: '/admin/order', title: 'Đơn hàng' }
					]
				}
			},
			{
				type: 'item',
				href: '/admin/discount',
				icon: 'fas fa-fw fa-code',
				title: 'Phiếu giảm giá'
			},
			{
				type: 'collapsedItem',
				name: 'user',
				icon: 'fas fa-fw fa-user',
				title: 'Người dùng',
				items: {
					list: [
						{ href: '/admin/user/admin', title: 'Quản trị viên' },
						{ href: '/admin/user/customer', title: 'Khách hàng' }
					]
				}
			},
			{
				type: 'item',
				href: '/admin/feedback',
				icon: 'fas fa-fw fa-file-lines',
				title: 'Phản hồi'
			},
			{
				type: 'item',
				href: '/admin/banner',
				icon: 'fas fa-fw fa-image',
				title: 'Bìa quảng cáo'
			}
		]
	}
};

const adminSlice = createSlice({
	name: 'admin',
	initialState,
	reducers: {
		setShowSidebar(state, action) {
			state.sidebar.show = action.payload;
			return state;
		}
	}
});

// Selectors
export const selectSidebar = state => state.admin.sidebar;
export const selectTheme = state => state.admin.theme;

// Actions
export const adminActions = adminSlice.actions;

// Reducer
const adminReducer = adminSlice.reducer;
export default adminReducer;
