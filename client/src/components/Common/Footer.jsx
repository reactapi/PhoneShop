import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const Footer = () => {
	return (
		<footer className="bg-dark text-white p-5">
			<Row>
				<Col xs={4} md={3} xl={2}>
					<h6 className="mb-4 fw-bold">LIÊN KẾT</h6>

					<div className="mb-3">
						<Link to="/" className="text-white">
							Trang chủ
						</Link>
					</div>
					<div className="mb-3">
						<Link to="/gioi-thieu" className="text-white">
							Giới thiệu
						</Link>
					</div>
					<div className="mb-3">
						<Link to="/lien-he" className="text-white">
							Liên hệ
						</Link>
					</div>
				</Col>

				<Col xs={8} md={9} xl={10}>
					<Row className="g-5">
						<Col md={6} xl={8}>
							<h6 className="fw-bold mb-4">LIÊN HỆ</h6>

							<div className="mb-3">
								<i className="fas fa-fw fa-home" />
								&nbsp;Ấp 2, xã Tân Định, huyện Bắc Tân Uyên, tỉnh Bình Dương
							</div>
							<div className="mb-3">
								<i className="fas fa-fw fa-phone-alt" />
								&nbsp;0385968197
							</div>
							<div className="mb-3">
								<i className="far fa-fw fa-paper-plane" />
								&nbsp;vhungitm@gmail.com
							</div>
							<div className="mb-3">
								<i className="fab fa-fw fa-facebook" />
								&nbsp;http://facebook.com/vhungitm
							</div>
						</Col>

						<Col md={6} xl={4}>
							<h6 className="fw-bold mb-4">THỜI GIAN LÀM VIỆC</h6>

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
						</Col>
					</Row>
				</Col>
			</Row>
			<div className="text-center mt-4">
				&copy; {new Date().getFullYear()}, Designed by <i className="fa fa-heart heart"></i> Hùng
				ITM
			</div>
		</footer>
	);
};
