import { yupResolver } from '@hookform/resolvers/yup';
import feedbackApi from 'api/feedbackApi';
import { selectAuthLoading, selectCurrentUser } from 'app/authSlice';
import { SplitButton } from 'components/Buttons/SplitButton';
import { InputField } from 'components/FormFields/InputField';
import { useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import * as yup from 'yup';

const ContactPage = () => {
	const validationSchema = yup.object().shape({
		name: yup.string().required('Vui lòng nhập họ tên!'),
		phone: yup.string().required('Vui lòng nhập số điện thoại!'),
		email: yup.string().required('Vui lòng nhập email!'),
		content: yup.string().required('Vui lòng nhập nội dung!')
	});

	const { control, setValue, reset, handleSubmit } = useForm({
		defaultValues: {
			name: '',
			phone: '',
			email: '',
			content: ''
		},
		resolver: yupResolver(validationSchema)
	});

	const currentUser = useSelector(selectCurrentUser);
	const authLoading = useSelector(selectAuthLoading);
	useEffect(() => {
		if (!authLoading && currentUser)
			reset({
				name: currentUser.name,
				phone: currentUser.phone,
				email: currentUser.email,
				content: ''
			});
	}, [reset, currentUser, authLoading]);

	const handleSendContact = async formValues => {
		try {
			const res = await feedbackApi.add({
				name: formValues.name,
				phone: formValues.phone,
				email: formValues.email,
				content: formValues.content
			});

			if (res.status) {
				toast.success(res.message);
				setValue('content', '');
			} else {
				toast.error(res.message);
			}
		} catch (error) {
			toast.error('Lỗi máy chủ! Gửi phản hồi không thành công!');
		}
	};

	return (
		<div className="bg-white p-5">
			<Row>
				<Col xl={6}>
					<div>
						<h5 className="fw-bold mb-4">THÔNG TIN LIÊN HỆ</h5>

						<div className="mb-3">
							<i className="fas fa-fw fa-home" />
							&nbsp;Địa chỉ: Ấp 2, xã Tân Định, huyện Bắc Tân
							Uyên, tỉnh Bình Dương
						</div>
						<div className="mb-3">
							<i className="fas fa-fw fa-phone-alt" />
							&nbsp;Số điện thoại: 0385968197
						</div>
						<div className="mb-3">
							<i className="far fa-fw fa-paper-plane" />
							&nbsp;Email:&nbsp;
							<a href="mailto:vhungitm@gmail.com">
								vhungitm@gmail.com
							</a>
						</div>
						<div className="mb-3">
							<i className="fab fa-fw fa-facebook" />
							&nbsp; Facebook:&nbsp;
							<a href="https://facebook.com/vhungitm">
								https://facebook.com/vhungitm
							</a>
						</div>
					</div>

					<div>
						<h5 className="fw-bold mt-5 mb-3">
							THỜI GIAN LÀM VIỆC
						</h5>

						<div className="mb-3">
							<i className="fas fa-fw fa-sun" />
							&nbsp;<b>Sáng: </b>7:00 - 11:00
						</div>
						<div className="mb-3">
							<i className="fas fa-fw fa-cloud-sun" />
							&nbsp;<b>Chiều: </b>13:00 - 17:00
						</div>
						<div className="mb-3">
							<i className="fas fa-fw fa-cloud-moon" />
							&nbsp;<b>Tối: </b>19:00 - 21:00
						</div>
					</div>
				</Col>
				<Col xl={6}>
					<h5 className="fw-bold mb-3 text-center">
						NỘI DUNG LIÊN HỆ
					</h5>
					<form onSubmit={handleSubmit(handleSendContact)}>
						<InputField
							control={control}
							label={
								<>
									Họ tên{' '}
									<span className="text-danger">(*)</span>
								</>
							}
							name="name"
						/>
						<InputField
							control={control}
							label={
								<>
									Số điện thoại{' '}
									<span className="text-danger">(*)</span>
								</>
							}
							name="phone"
						/>
						<InputField
							control={control}
							label={
								<>
									Email{' '}
									<span className="text-danger">(*)</span>
								</>
							}
							name="email"
						/>
						<InputField
							control={control}
							label={
								<>
									Nội dung{' '}
									<span className="text-danger">(*)</span>
								</>
							}
							name="content"
						/>

						<SplitButton
							type="submit"
							icon="fas fa-check"
							text="Gửi"
						/>
					</form>
				</Col>
			</Row>
		</div>
	);
};

export default ContactPage;
