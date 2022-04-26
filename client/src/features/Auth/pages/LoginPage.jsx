import authApi from 'api/authApi';
import { authActions, getMe, selectCurrentUser } from 'app/authSlice';
import { InputField } from 'components/FormFields';
import { useEffect } from 'react';
import { Button, FormCheck } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const LoginPage = props => {
	const dispatch = useDispatch();
	const history = useHistory();
	const currentUser = useSelector(selectCurrentUser);
	const { isAdmin, isLogin } = props;

	useEffect(() => {
		if (isLogin) {
			if (isAdmin) {
				if (currentUser && currentUser.userGroup.name === 'ADMIN')
					history.push('/admin');
			} else {
				if (currentUser) history.push('/');
			}
		} else {
			localStorage.removeItem('accessToken');
			dispatch(authActions.setCurrentUser(null));

			history.push(isAdmin ? '/admin/login' : '/dang-nhap');
		}
	}, [history, dispatch, currentUser, isLogin, isAdmin]);

	// Form
	const validationSchema = yup.object().shape({
		username: yup.string().required('Vui lòng nhập tài khoản!'),
		password: yup.string().required('Vui lòng nhập mật khẩu!')
	});

	const { control, register, handleSubmit } = useForm({
		defaultValues: {
			username: '',
			password: '',
			rememberMe: false
		},
		resolver: yupResolver(validationSchema)
	});

	const handleLogin = async formValues => {
		try {
			const params = {
				username: formValues.username,
				password: formValues.password,
				userGroup: isAdmin ? 'ADMIN' : undefined
			};

			const res = await authApi.login(params);

			if (res.status) {
				localStorage.setItem('accessToken', res.accessToken);
				dispatch(getMe(res.accessToken));
				toast.success(res.message);

				history.push(isAdmin ? '/admin' : '/');
			} else {
				toast.error(res.message);
			}
		} catch (error) {
			toast.error('Lỗi hệ thống! Đăng nhập không thành công!');
		}
	};

	return (
		<div
			className="bg-light d-flex justify-content-center py-5"
			style={{ minHeight: '100vh' }}
		>
			<div>
				<div
					className="bg-white border rounded shadow"
					style={{ width: 400, maxWidth: '100%' }}
				>
					<div
						className="border-bottom d-flex justify-content-center"
						style={{ height: 140 }}
					>
						<img
							src="/Images/no-avatar.png"
							alt="No avatar"
							className="rounded-circle bg-white"
							style={{ marginTop: 100 }}
							width={80}
							height={80}
						/>
					</div>
					<div className="p-5">
						<form
							className="mt-5"
							onSubmit={handleSubmit(handleLogin)}
						>
							<InputField
								control={control}
								name="username"
								label={
									<>
										<i className="fas fa-fw fa-user"></i>{' '}
										Tài khoản
									</>
								}
								placeholder="Số điện thoại / Email"
							/>
							<InputField
								control={control}
								type="password"
								name="password"
								label={
									<>
										<i className="fas fa-fw fa-lock"></i>{' '}
										Mật khẩu
									</>
								}
								placeholder="********"
							/>

							<FormCheck
								{...register('rememberMe')}
								name="rememberMe"
								label="Nhớ tài khoản"
								className="mb-3"
							/>

							<div className="d-grid">
								<Button type="submit">
									<i className="fas fa-fw fa-sign-in-alt"></i>
									&nbsp;&nbsp;Đăng nhập
								</Button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
