import { yupResolver } from '@hookform/resolvers/yup'
import authApi from 'api/authApi'
import { getMe } from 'app/authSlice'
import { InputField } from 'components/FormFields'
import { SelectField } from 'components/FormFields/SelectField'
import { Button } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import * as yup from 'yup'

const RegisterPage = () => {
	const dispatch = useDispatch()
	const history = useHistory()

	// Form
	const validationSchema = yup.object().shape({
		phone: yup
			.string()
			.required('Vui lòng nhập số điện thoại!')
			.min(10, 'Số điện thoại phải có ít nhất 10 số!')
			.max(11, 'Số điện thoại phải có tốt đa 10 số!'),
		email: yup
			.string()
			.email('Sai định dạng email!')
			.required('Vui lòng nhập email!'),
		password: yup.string().required('Vui lòng nhập mật khẩu!'),
		confirmPassword: yup
			.string()
			.when('password', (password, field) =>
				password
					? field
							.required('Mật khẩu lặp lại không đúng!')
							.oneOf(
								[yup.ref('password')],
								'Mật khẩu nhập lại không đúng!'
							)
					: field
			),
		name: yup.string().required('Vui lòng nhập họ tên!'),
		dateOfBirth: yup.string().required('Vui lòng nhập ngày sinh!'),
		address: yup.string().required('Vui lòng nhập địa chỉ!')
	})

	const { control, handleSubmit } = useForm({
		defaultValues: {
			password: '',
			confirmPassword: '',
			name: '',
			gender: 'Nam',
			dateOfBirth: '1990-01-01',
			address: '',
			phone: '',
			email: ''
		},
		resolver: yupResolver(validationSchema)
	})

	const handleRegister = async formValues => {
		try {
			const params = {
				username: formValues.phone,
				password: formValues.password,
				name: formValues.name,
				gender: formValues.gender,
				dateOfBirth: formValues.dateOfBirth,
				address: formValues.address,
				phone: formValues.phone,
				email: formValues.email
			}

			const res = await authApi.register(params)

			if (res.status) {
				localStorage.setItem('accessToken', res.accessToken)
				dispatch(getMe(res.accessToken))
				toast.success(res.message)

				history.push('/')
			} else {
				toast.error(res.message)
			}
		} catch (error) {
			toast.error('Lỗi hệ thống! Đăng ký không thành công!')
		}
	}

	return (
		<div
			className='bg-light d-flex justify-content-center py-5'
			style={{ minHeight: '100vh' }}
		>
			<div>
				<div
					className='bg-white border rounded shadow'
					style={{ width: 400, maxWidth: '100%' }}
				>
					<div
						className='border-bottom d-flex justify-content-center'
						style={{ height: 140 }}
					>
						<img
							src='/Images/no-avatar.png'
							alt='No avatar'
							className='rounded-circle bg-white'
							style={{ marginTop: 100 }}
							width={80}
							height={80}
						/>
					</div>

					<div className='p-5'>
						<form
							className='mt-5'
							onSubmit={handleSubmit(handleRegister)}
						>
							<InputField
								control={control}
								name='phone'
								label={
									<>
										Số điện thoại{' '}
										<span className='text-danger'>(*)</span>
									</>
								}
							/>
							<InputField
								control={control}
								name='email'
								label={
									<>
										Email{' '}
										<span className='text-danger'>(*)</span>
									</>
								}
							/>
							<InputField
								control={control}
								type='password'
								name='password'
								label={
									<>
										Mật khẩu{' '}
										<span className='text-danger'>(*)</span>
									</>
								}
							/>
							<InputField
								control={control}
								type='password'
								name='confirmPassword'
								label={
									<>
										Nhập lại mật khẩu{' '}
										<span className='text-danger'>(*)</span>
									</>
								}
							/>
							<InputField
								control={control}
								name='name'
								label={
									<>
										Họ tên{' '}
										<span className='text-danger'>(*)</span>
									</>
								}
							/>
							<SelectField
								control={control}
								name='gender'
								label={
									<>
										Giới tính{' '}
										<span className='text-danger'>(*)</span>
									</>
								}
								options={[
									{ label: 'Nam', value: 'Nam' },
									{ label: 'Nữ', value: 'Nữ' }
								]}
							/>
							<InputField
								control={control}
								name='dateOfBirth'
								type='date'
								label={
									<>
										Ngày sinh{' '}
										<span className='text-danger'>(*)</span>
									</>
								}
							/>
							<InputField
								control={control}
								name='address'
								label={
									<>
										Địa chỉ{' '}
										<span className='text-danger'>(*)</span>
									</>
								}
							/>

							<div className='d-grid mt-4'>
								<Button type='submit'>
									<i className='fas fa-fw fa-user-plus'></i>
									&nbsp;&nbsp;Đăng ký
								</Button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	)
}

export default RegisterPage
